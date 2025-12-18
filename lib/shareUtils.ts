/**
 * Utility functions for sharing with frame overlay
 */

export async function applyFrameToImage(
  imageUrl: string,
  frameUrl: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const frame = new Image();
    
    img.crossOrigin = "anonymous";
    frame.crossOrigin = "anonymous";
    
    let imagesLoaded = 0;
    
    const onImageLoad = () => {
      imagesLoaded++;
      if (imagesLoaded === 2) {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          
          if (!ctx) {
            reject(new Error("Could not get canvas context"));
            return;
          }
          
          // Draw the original image
          ctx.drawImage(img, 0, 0);
          
          // Draw the frame on top
          ctx.drawImage(frame, 0, 0, img.width, img.height);
          
          // Convert to blob URL
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              resolve(url);
            } else {
              reject(new Error("Failed to create blob"));
            }
          }, "image/png");
        } catch (error) {
          reject(error);
        }
      }
    };
    
    img.onerror = () => reject(new Error("Failed to load image"));
    frame.onerror = () => reject(new Error("Failed to load frame"));
    
    img.onload = onImageLoad;
    frame.onload = onImageLoad;
    
    img.src = imageUrl;
    frame.src = frameUrl;
  });
}

export async function shareToFacebook(imageUrl: string, text: string) {
  // Try Web Share API first (mobile)
  if (navigator.share) {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], `pulover-${Date.now()}.png`, { type: "image/png" });
      
      await navigator.share({
        title: "Ugliest Christmas Sweater",
        text: text,
        files: [file]
      });
      return;
    } catch (err) {
      console.log("Web Share API failed, falling back to download");
    }
  }

  // Fallback: download image and open Facebook
  downloadImage(imageUrl, `pulover-share-${Date.now()}.png`);
  setTimeout(() => {
    const url = `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "width=600,height=400");
    alert("Poza a fost descărcată! O poți încărca pe Facebook.");
  }, 500);
}

export async function shareToInstagram(imageUrl: string) {
  // Try Web Share API first (mobile)
  if (navigator.share) {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], `pulover-${Date.now()}.png`, { type: "image/png" });
      
      await navigator.share({
        title: "Ugliest Christmas Sweater",
        text: "Am participat la concursul Ugliest Christmas Sweater! 🎄🧥",
        files: [file]
      });
      return;
    } catch (err) {
      console.log("Web Share API failed, falling back to download");
    }
  }

  // Fallback: download image
  downloadImage(imageUrl, `pulover-share-${Date.now()}.png`);
  setTimeout(() => {
    alert("Poza a fost descărcată! Deschide Instagram și postează poza din galeria ta.");
  }, 500);
}

export async function downloadImage(imageUrl: string, filename: string) {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading image:", error);
  }
}

