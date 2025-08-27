export default function ProductCard({ img, title, price }) {
  return (
    <article className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition">
      <div className="aspect-w-4 aspect-h-3">
        <img src={img} alt={title} className="object-cover w-full h-full" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="mt-2 text-sm text-gray-500">{price}</p>
      </div>
    </article>
  );
}
