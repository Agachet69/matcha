export const ValidImg = (file) => {
  const maxSize = 5000 * 1024; // 5000 Ko
  const typesMIMEImages = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/svg+xml",
  ];
  if (!typesMIMEImages.includes(file.type)) {
    console.log("Le fichier n'est pas supporté");
    return false
  }
  if (file && file.size > maxSize) {
    console.log("image trop volumineuse");
    return false;
  }
  return true;
};
