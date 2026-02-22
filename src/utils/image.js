/**
 * Image optimization and manipulation utilities
 */

export const imageUtils = {
  /**
   * Generate optimized image URL with parameters
   * @param {string} baseUrl - Base image URL
   * @param {object} options - Optimization options
   * @returns {string} Optimized image URL
   */
  optimizeImageUrl: (baseUrl, options = {}) => {
    if (!baseUrl) return '';

    const {
      width,
      height,
      quality = 80,
      format = 'webp',
      fit = 'cover', // cover, contain, fill, inside, outside
    } = options;

    // For services like Cloudinary, Imgix, etc.
    // This is a generic implementation - adapt based on your image service

    const params = new URLSearchParams();

    if (width) params.append('w', width.toString());
    if (height) params.append('h', height.toString());
    if (quality) params.append('q', quality.toString());
    if (format) params.append('f', format);
    if (fit) params.append('fit', fit);

    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}${params.toString()}`;
  },

  /**
   * Generate responsive image srcSet
   * @param {string} baseUrl - Base image URL
   * @param {array} sizes - Array of width sizes
   * @param {object} options - Additional options
   * @returns {string} srcSet string
   */
  generateSrcSet: (baseUrl, sizes = [320, 640, 768, 1024, 1280, 1920], options = {}) => {
    return sizes
      .map(width => `${imageUtils.optimizeImageUrl(baseUrl, { ...options, width })} ${width}w`)
      .join(', ');
  },

  /**
   * Get image dimensions
   * @param {string} src - Image source URL
   * @returns {Promise<{width: number, height: number}>} Image dimensions
   */
  getImageDimensions: (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
      img.onerror = reject;
      img.src = src;
    });
  },

  /**
   * Calculate aspect ratio
   * @param {number} width - Image width
   * @param {number} height - Image height
   * @returns {number} Aspect ratio
   */
  calculateAspectRatio: (width, height) => {
    return width / height;
  },

  /**
   * Resize image maintaining aspect ratio
   * @param {number} originalWidth - Original width
   * @param {number} originalHeight - Original height
   * @param {number} maxWidth - Maximum width
   * @param {number} maxHeight - Maximum height
   * @returns {{width: number, height: number}} New dimensions
   */
  resizeImage: (originalWidth, originalHeight, maxWidth, maxHeight) => {
    let width = originalWidth;
    let height = originalHeight;

    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }

    if (height > maxHeight) {
      width = (width * maxHeight) / height;
      height = maxHeight;
    }

    return {
      width: Math.round(width),
      height: Math.round(height),
    };
  },

  /**
   * Convert file size to human readable format
   * @param {number} bytes - File size in bytes
   * @returns {string} Human readable file size
   */
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  /**
   * Validate image file
   * @param {File} file - Image file
   * @param {object} options - Validation options
   * @returns {object} Validation result
   */
  validateImageFile: (file, options = {}) => {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB
      allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      minWidth = 0,
      minHeight = 0,
      maxWidth = 0,
      maxHeight = 0,
    } = options;

    const errors = [];

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      errors.push(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
    }

    // Check file size
    if (file.size > maxSize) {
      errors.push(`File size too large. Maximum size: ${imageUtils.formatFileSize(maxSize)}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Compress image file
   * @param {File} file - Image file
   * @param {object} options - Compression options
   * @returns {Promise<File>} Compressed image file
   */
  compressImage: async (file, options = {}) => {
    const {
      quality = 0.8,
      maxWidth = 1920,
      maxHeight = 1080,
    } = options;

    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        const { width, height } = imageUtils.resizeImage(
          img.naturalWidth,
          img.naturalHeight,
          maxWidth,
          maxHeight
        );

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          file.type,
          quality
        );
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  },

  /**
   * Generate image placeholder/thumbnail
   * @param {string} src - Image source
   * @param {number} width - Placeholder width
   * @param {number} height - Placeholder height
   * @returns {string} Data URL for placeholder
   */
  generatePlaceholder: (width = 400, height = 300) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f3f4f6');
    gradient.addColorStop(1, '#e5e7eb');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add placeholder text
    ctx.fillStyle = '#9ca3af';
    ctx.font = `${Math.min(width, height) / 10}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Loading...', width / 2, height / 2);

    return canvas.toDataURL();
  },

  /**
   * Preload image
   * @param {string} src - Image source URL
   * @returns {Promise<void>} Promise that resolves when image is loaded
   */
  preloadImage: (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = reject;
      img.src = src;
    });
  },

  /**
   * Lazy load images with Intersection Observer
   * @param {string} selector - CSS selector for images
   * @param {object} options - Lazy loading options
   */
  lazyLoadImages: (selector = 'img[data-src]', options = {}) => {
    const {
      rootMargin = '50px',
      threshold = 0.1,
    } = options;

    const images = document.querySelectorAll(selector);

    if (!images.length) return;

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.dataset.src;

          if (src) {
            img.src = src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        }
      });
    }, { rootMargin, threshold });

    images.forEach(img => imageObserver.observe(img));
  },
};
