export const getUserId = (req: any) => {
  try {
    const id = req.user.sub;
    return id;
  } catch {}
};
