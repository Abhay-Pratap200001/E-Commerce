import { useState, useEffect } from "react";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import ProductCard from "./ProductCard";

const PeopleAlsoBought = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get("/products/recommendation");
        setRecommendations(res.data);
      } catch (error) {
        toast.error(error.response.data.message || "Error fetching products");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-semibold text-emerald-400 mb-4">
        People Also Bought
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default PeopleAlsoBought;
