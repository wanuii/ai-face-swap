export const swapFaceAPI = async (formData) => {
    const res = await fetch("https://web-production-62d42.up.railway.app/process-images/", {
      method: "POST",
      body: formData,
    });
    return res;
  };
  