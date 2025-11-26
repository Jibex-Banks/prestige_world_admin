import api from './api';

export const uploadService = {
  // Get Image url
  imageUrl: async ()=>{
    return await api.get("/getImageUrl");
  },

  // Upload single file
  uploadFile: async (file, folder = 'products') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    
    return await api.uploadFile('/upload', file);
  },

  // Upload multiple files
  uploadMultipleFiles: async (files, folder = 'products') => {
    const uploadPromises = files.map(file => uploadService.uploadFile(file, folder));
    return await Promise.all(uploadPromises);
  },

  // Delete file
  deleteFile: async (fileUrl) => {
    return await api.delete('/upload', { fileUrl });
  },
};
