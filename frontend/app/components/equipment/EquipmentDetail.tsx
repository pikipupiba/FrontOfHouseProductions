'use client';

import React from 'react';
import Image from 'next/image';
import { Equipment } from '@/lib/mock/data/equipment';

interface EquipmentDetailProps {
  equipment: Equipment;
  onClose?: () => void;
  isModal?: boolean;
}

export default function EquipmentDetail({ equipment, onClose, isModal = false }: EquipmentDetailProps) {
  const getFallbackImage = (name: string) => {
    // Return a data URI for a colored placeholder with the first letter
    const firstLetter = name.charAt(0).toUpperCase();
    const colors = ['#4F46E5', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444'];
    const colorIndex = Math.floor(name.length % colors.length);
    const color = colors[colorIndex] || '#4F46E5'; // Fallback to first color if undefined
    
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100' fill='none'%3E%3Crect width='100' height='100' fill='${color.replace('#', '%23')}'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='40' fill='white' text-anchor='middle' dominant-baseline='middle'%3E${firstLetter}%3C/text%3E%3C/svg%3E`;
  };
  
  // Format a display string for dimensions if available
  const dimensionsDisplay = equipment.dimensions ? 
    `${equipment.dimensions.width}×${equipment.dimensions.height}×${equipment.dimensions.depth} ${equipment.dimensions.unit}` 
    : 'Not specified';

  return (
    <div className={`bg-white w-full ${isModal ? 'rounded-lg shadow-xl max-w-4xl' : ''}`}>
      {isModal && (
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Equipment Details</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row">
        {/* Left column: Image */}
        <div className="w-full md:w-2/5 h-64 md:h-auto relative overflow-hidden">
          <Image
            src={equipment.imageUrl || getFallbackImage(equipment.name)}
            alt={equipment.name}
            fill
            className="object-cover"
          />
          {equipment.featured && (
            <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
              Featured
            </div>
          )}
        </div>
        
        {/* Right column: Details */}
        <div className="w-full md:w-3/5 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{equipment.name}</h1>
          
          <div className="mb-4">
            <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-2.5 py-0.5 rounded">
              ${equipment.price}/{equipment.priceUnit}
            </span>
            <span className="inline-block ml-2 text-sm text-gray-500">
              {equipment.availableQuantity} available
            </span>
          </div>
          
          <p className="text-gray-700 mb-6">{equipment.description}</p>
          
          {/* Specifications */}
          <div className="border-t border-gray-200 pt-4 mb-6">
            <h2 className="text-lg font-semibold mb-3">Specifications</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
              {equipment.manufacturer && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Manufacturer:</span>
                  <span className="font-medium">{equipment.manufacturer}</span>
                </div>
              )}
              
              {equipment.model && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Model:</span>
                  <span className="font-medium">{equipment.model}</span>
                </div>
              )}
              
              {equipment.condition && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Condition:</span>
                  <span className="font-medium capitalize">{equipment.condition}</span>
                </div>
              )}
              
              {equipment.dimensions && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Dimensions:</span>
                  <span className="font-medium">{dimensionsDisplay}</span>
                </div>
              )}
              
              {equipment.weight && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Weight:</span>
                  <span className="font-medium">{equipment.weight} lbs</span>
                </div>
              )}
              
              {equipment.powerRequirements && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Power:</span>
                  <span className="font-medium">{equipment.powerRequirements}</span>
                </div>
              )}
            </div>
            
            {equipment.specifications && (
              <div className="mt-4">
                <h3 className="text-md font-semibold mb-2">Additional Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                  {Object.entries(equipment.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 capitalize">{key}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
              Add to Quote
            </button>
            <button className="flex-1 px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors">
              Check Availability
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
