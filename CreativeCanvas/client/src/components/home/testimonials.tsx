import { Star, StarHalf } from "lucide-react";

type Testimonial = {
  id: number;
  name: string;
  location: string;
  rating: number;
  text: string;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    text: "Perfect solution for my temporary accommodation. The furniture quality was excellent, and the delivery team was professional and efficient."
  },
  {
    id: 2,
    name: "Rajesh Patel",
    location: "Bangalore",
    rating: 4.5,
    text: "As a student in a new city, this service was a lifesaver. Affordable, quality furniture without the commitment of buying. Highly recommend!"
  },
  {
    id: 3,
    name: "Ananya Desai",
    location: "Delhi",
    rating: 5,
    text: "The flexibility to change furniture every few months is amazing. It keeps my home feeling fresh and I don't have to commit to one style."
  }
];

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  
  return (
    <div className="text-amber-500 flex">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-current" />
      ))}
      {hasHalfStar && <StarHalf className="h-4 w-4 fill-current" />}
    </div>
  );
}

export default function Testimonials() {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">What Our Customers Say</h2>
          <p className="mt-4 text-lg text-gray-500">Don't just take our word for it</p>
        </div>
        
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-gray-50 rounded-lg p-6 border border-gray-100">
              <div className="flex items-center mb-4">
                <StarRating rating={testimonial.rating} />
              </div>
              <p className="text-gray-600 mb-6">"{testimonial.text}"</p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center text-gray-500">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
