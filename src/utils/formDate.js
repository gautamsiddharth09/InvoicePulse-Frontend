// export const formatDate = (date) => {
//   if (!date) return "";

//   return new Date(date)
//     .toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     })
//     .replace(/ /g, "/");
// };


export const formatDate = (date) => {
  if (!date) return "";

  const d = new Date(date);

  const day = String(d.getDate()).padStart(2, "0");
  const month = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ][d.getMonth()];
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};