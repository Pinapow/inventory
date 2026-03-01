package com.inventory.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.inventory.dto.request.CreateUserRequest;
import com.inventory.dto.request.GoogleAuthRequest;
import com.inventory.dto.request.LoginRequest;
import com.inventory.dto.request.SignupRequest;
import com.inventory.dto.response.AuthResponse;
import com.inventory.dto.response.UserResponse;
import com.inventory.enums.Role;
import com.inventory.exception.UnauthorizedException;
import com.inventory.exception.UserNotFoundException;
import com.inventory.model.User;
import com.inventory.repository.UserRepository;
import com.inventory.security.CookieService;
import com.inventory.security.CustomUserDetails;
import com.inventory.security.JwtService;
import com.inventory.service.IAuthService;
import com.inventory.service.IUserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements IAuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final CookieService cookieService;
    private final UserRepository userRepository;
    private final IUserService userService;
    private final RestTemplate restTemplate;

    private static final String GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

    @Override
    public AuthResponse login(LoginRequest request, HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getEmail())
            .orElseThrow(() -> new UserNotFoundException(userDetails.getEmail()));

        setAuthCookie(response, user);

        return new AuthResponse(
            UserResponse.fromEntity(user),
            "Login successful"
        );
    }

    @Override
    public AuthResponse signup(SignupRequest request, HttpServletResponse response) {
        CreateUserRequest createRequest = new CreateUserRequest(
            request.email(),
            request.password(),
            Role.USER
        );

        User user = userService.createUser(createRequest);
        setAuthCookie(response, user);

        return new AuthResponse(
            UserResponse.fromEntity(user),
            "Signup successful"
        );
    }

    @Override
    public AuthResponse googleAuth(GoogleAuthRequest request, HttpServletResponse response) {
        JsonNode userInfo = fetchGoogleUserInfo(request.credential());

        String googleId = userInfo.get("sub").asText();
        String email = userInfo.get("email").asText();
        String pictureUrl = userInfo.has("picture") ? userInfo.get("picture").asText() : null;

        User user = userRepository.findByGoogleId(googleId)
            .orElseGet(() -> findOrCreateGoogleUser(googleId, email, pictureUrl));

        setAuthCookie(response, user);

        return new AuthResponse(
            UserResponse.fromEntity(user),
            "Google authentication successful"
        );
    }

    @Override
    public void logout(HttpServletResponse response) {
        cookieService.clearAccessTokenCookie(response);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UserNotFoundException(email));

        return UserResponse.fromEntity(user);
    }

    private void setAuthCookie(HttpServletResponse response, User user) {
        String token = jwtService.generateToken(
            user.getId(),
            user.getEmail(),
            user.getRole().name()
        );
        cookieService.setAccessTokenCookie(response, token);
    }

    private JsonNode fetchGoogleUserInfo(String accessToken) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);

            ResponseEntity<JsonNode> response = restTemplate.exchange(
                GOOGLE_USERINFO_URL,
                HttpMethod.GET,
                new HttpEntity<>(headers),
                JsonNode.class
            );

            JsonNode body = response.getBody();
            if (body == null || !body.has("sub") || !body.has("email")) {
                throw new UnauthorizedException("Invalid Google user info response");
            }

            return body;
        } catch (RestClientException e) {
            log.warn("Failed to verify Google access token: {}", e.getMessage());
            throw new UnauthorizedException("Invalid Google credential");
        }
    }

    private User findOrCreateGoogleUser(String googleId, String email, String pictureUrl) {
        return userRepository.findByEmail(email)
            .map(existingUser -> {
                existingUser.setGoogleId(googleId);
                existingUser.setPictureUrl(pictureUrl);
                return userRepository.save(existingUser);
            })
            .orElseGet(() -> {
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setGoogleId(googleId);
                newUser.setPictureUrl(pictureUrl);
                newUser.setRole(Role.USER);
                newUser.setEnabled(true);
                return userRepository.save(newUser);
            });
    }
}
