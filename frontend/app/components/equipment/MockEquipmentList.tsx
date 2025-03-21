'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { EquipmentCategory, Equipment } from '@/lib/mock/data/equipment';
import EquipmentDetail from './EquipmentDetail';

interface MockEquipmentListProps {
  initialCategory?: string;
}

export default function MockEquipmentList({ initialCategory }: MockEquipmentListProps) {
  const [categories, setCategories] = useState<EquipmentCategory[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null);
  const [searchQuery, setSearchQuery] = useState('');
  // For equipment details modal
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch equipment categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/mock/equipment/categories');
        const result = await response.json();
        
        if (result.data) {
          setCategories(result.data);
        }
      } catch (error) {
        console.error('Error fetching equipment categories:', error);
        setError('Failed to load equipment categories. Please try again later.');
      }
    };
    
    fetchCategories();
  }, []);

  // Fetch equipment data
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (selectedCategory) {
          params.append('categoryId', selectedCategory);
        }
        if (searchQuery) {
          params.append('search', searchQuery);
        }
        
        const queryString = params.toString();
        const url = `/api/mock/equipment${queryString ? `?${queryString}` : ''}`;
        
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.data) {
          setEquipment(result.data);
        }
        
        setError(null);
      } catch (error) {
        console.error('Error fetching equipment data:', error);
        setError('Failed to load equipment data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEquipment();
  }, [selectedCategory, searchQuery]);

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Generate a fallback image based on equipment name for consistency
  const getFallbackImage = (name: string) => {
    // Return a data URI for a colored placeholder with the first letter
    const firstLetter = name.charAt(0).toUpperCase();
    const colors = ['#4F46E5', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444'];
    const colorIndex = Math.floor(name.length % colors.length);
    const color = colors[colorIndex] || '#4F46E5'; // Fallback to first color if undefined
    
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100' fill='none'%3E%3Crect width='100' height='100' fill='${color.replace('#', '%23')}'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='40' fill='white' text-anchor='middle' dominant-baseline='middle'%3E${firstLetter}%3C/text%3E%3C/svg%3E`;
  };

  if (loading && categories.length === 0) {
    return (
      <div className="flex flex-col space-y-4 w-full max-w-7xl mx-auto px-4">
        <div className="h-10 bg-gray-200 rounded-md w-1/3 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-300"></div>
              <div className="p-4">
                <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  // Handle opening the equipment detail modal
  const handleViewDetails = (item: Equipment) => {
    setSelectedEquipment(item);
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Wait for the animation to complete before clearing the selected equipment
    setTimeout(() => {
      setSelectedEquipment(null);
    }, 300);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      {/* Search and filter bar */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search equipment..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
          
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {equipment.length} {equipment.length === 1 ? 'item' : 'items'} found
          {selectedCategory && categories.find(c => c.id === selectedCategory) && 
            ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </h2>
      </div>

      {/* Equipment grid */}
      {equipment.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900">No equipment found</h3>
          <p className="mt-2 text-gray-600">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {equipment.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 relative">
                <Image
                  src={item.imageUrl || getFallbackImage(item.name)}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
                {item.featured && (
                  <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                    Featured
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-blue-600 font-bold">
                    ${item.price}/{item.priceUnit}
                  </span>
                  <button 
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                    onClick={() => handleViewDetails(item)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Equipment Detail Modal */}
      {isModalOpen && selectedEquipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="relative animate-fadeIn">
            <EquipmentDetail 
              equipment={selectedEquipment} 
              onClose={handleCloseModal} 
              isModal={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
