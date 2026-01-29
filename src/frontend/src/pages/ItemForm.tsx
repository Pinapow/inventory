import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Upload, AlertCircle } from 'lucide-react';
import { itemsApi } from '../services/api';
import { ItemFormData, STATUS_OPTIONS } from '../types/item';
import { Skeleton, SkeletonText } from '../components/Skeleton';
import { useToast } from '../components/Toast';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export default function ItemForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const { showToast } = useToast();

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ItemFormData>({
    defaultValues: {
      name: '',
      category: '',
      status: 'In Stock',
    },
  });

  useEffect(() => {
    if (isEditing && id) {
      loadItem(id);
    }
  }, [id, isEditing]);

  const loadItem = async (itemId: string) => {
    try {
      const item = await itemsApi.getById(itemId);
      reset({
        name: item.name,
        category: item.category,
        status: item.status,
      });
      if (item.imageBase64 && item.contentType) {
        setImagePreview(`data:${item.contentType};base64,${item.imageBase64}`);
      }
    } catch (error) {
      console.error('Failed to load item:', error);
      showToast('Failed to load item', 'error');
      navigate('/inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        showToast('File size must be less than 10MB', 'error');
        return;
      }
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        showToast('Only JPEG, PNG, GIF, and WebP images are allowed', 'error');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ItemFormData) => {
    setSubmitting(true);
    try {
      if (isEditing && id) {
        await itemsApi.update(id, data, imageFile || undefined);
        showToast('Item updated successfully', 'success');
      } else {
        await itemsApi.create(data, imageFile || undefined);
        showToast('Item created successfully', 'success');
      }
      navigate('/inventory');
    } catch (error) {
      console.error('Failed to save item:', error);
      showToast('Failed to save item. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <SkeletonText className="w-36 h-5 mb-6" />
        <div className="bg-gradient-to-br from-surface-elevated/80 to-surface-card/80 rounded-2xl border border-white/[0.06] shadow-premium p-8">
          <SkeletonText className="w-40 h-9 mb-8" />
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <SkeletonText className="w-20 h-4 mb-2" />
                <Skeleton className="w-full h-12 rounded-xl" />
              </div>
            ))}
            <div className="flex gap-4 pt-2">
              <Skeleton className="flex-1 h-12 rounded-xl" />
              <Skeleton className="flex-1 h-12 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <button
        onClick={() => navigate('/inventory')}
        className="inline-flex items-center text-stone-400 hover:text-stone-200 mb-6 transition-all duration-200 hover:-translate-x-0.5 group"
      >
        <ArrowLeft className="h-5 w-5 mr-1.5 transition-transform group-hover:-translate-x-0.5" />
        Back to Inventory
      </button>

      <div className="bg-gradient-to-br from-surface-elevated/80 to-surface-card/80 backdrop-blur-xl rounded-2xl border border-white/[0.06] shadow-premium p-8">
        <h1 className="font-display text-3xl text-stone-100 mb-8 tracking-tight">
          {isEditing ? 'Edit Item' : 'Add New Item'}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-xs font-medium text-stone-400 mb-2 uppercase tracking-wider">
              Name *
            </label>
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              className={`w-full px-4 py-3 bg-surface-base/50 border rounded-xl text-stone-100 placeholder-stone-500 transition-all duration-200 focus:outline-none focus:ring-2 hover:border-white/[0.12] ${
                errors.name
                  ? 'border-red-400/40 focus:ring-red-400/30 focus:border-red-400/50'
                  : 'border-white/[0.08] focus:ring-amber-500/30 focus:border-amber-500/40'
              }`}
              placeholder="Enter item name"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-400 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1.5" />
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-400 mb-2 uppercase tracking-wider">
              Category
            </label>
            <input
              type="text"
              {...register('category')}
              className="w-full px-4 py-3 bg-surface-base/50 border border-white/[0.08] rounded-xl text-stone-100 placeholder-stone-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/40 hover:border-white/[0.12]"
              placeholder="Enter category"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-400 mb-2 uppercase tracking-wider">
              Status
            </label>
            <select
              {...register('status')}
              className="w-full px-4 py-3 bg-surface-base/50 border border-white/[0.08] rounded-xl text-stone-100 cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/40 hover:border-white/[0.12]"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-400 mb-2 uppercase tracking-wider">
              Image
            </label>
            <div className="mt-1 flex justify-center px-6 pt-6 pb-6 border-2 border-white/[0.08] border-dashed rounded-xl bg-surface-base/30 transition-all duration-200 hover:border-amber-500/30 hover:bg-surface-base/50 group cursor-pointer">
              <div className="space-y-3 text-center">
                {imagePreview ? (
                  <div className="mb-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mx-auto h-32 w-32 object-cover rounded-xl ring-2 ring-white/[0.1]"
                    />
                  </div>
                ) : (
                  <Upload className="mx-auto h-12 w-12 text-stone-500 transition-all duration-200 group-hover:scale-110 group-hover:text-amber-400" />
                )}
                <div className="flex text-sm text-stone-400 justify-center">
                  <label className="relative cursor-pointer rounded-md font-medium text-amber-400 hover:text-amber-300 transition-colors">
                    <span>{imagePreview ? 'Change image' : 'Upload an image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </label>
                </div>
                <p className="text-xs text-stone-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/inventory')}
              className="flex-1 px-5 py-3 bg-white/[0.04] text-stone-300 font-medium rounded-xl border border-white/[0.08] transition-all duration-200 hover:bg-white/[0.08] hover:border-white/[0.12] hover:text-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-surface-base font-semibold rounded-xl shadow-glow-amber transition-all duration-200 hover:from-amber-400 hover:to-amber-500 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {submitting ? 'Saving...' : isEditing ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
