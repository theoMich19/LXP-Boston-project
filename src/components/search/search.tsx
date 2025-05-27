"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
    Search,
    MapPin,
    Check,
    X,
    Loader2
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAddressSearch } from "@/hooks/useAddressSearch";
import { Address } from "@/types/adress";

const AdressSearchInput = () => {
    const { addresses, loading, searchAddresses, clearAddresses } = useAddressSearch();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.trim() && searchQuery.length >= 3 && !selectedAddress) {
                searchAddresses(searchQuery);
                setShowDropdown(true);
            } else if (!searchQuery.trim()) {
                setShowDropdown(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, searchAddresses, selectedAddress]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (selectedAddress && value !== selectedAddress.label) {
            setSelectedAddress(null);
        }
    };

    const handleAddressSelect = (address: Address) => {
        setSelectedAddress(address);
        setSearchQuery(address.label);
        setShowDropdown(false);
        clearAddresses();
    };

    const clearSelection = () => {
        setSearchQuery('');
        setSelectedAddress(null);
        setShowDropdown(false);
        clearAddresses();
    };

    return (
        <div className="space-y-4">
            <div className="relative">
                <div className="relative" ref={inputRef}>
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input
                        type="text"
                        value={searchQuery}
                        onChange={handleInputChange}
                        onFocus={() => {
                            if (addresses.length > 0 && searchQuery.length >= 3) {
                                setShowDropdown(true);
                            }
                        }}
                        placeholder={"Rechercher une adresse..."}
                        className={`pl-10 pr-10 ${selectedAddress ? 'border-success' : ''}`}
                        aria-label="Recherche d'adresse"
                        autoComplete="off"
                    />

                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {loading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                        {selectedAddress && !loading && (
                            <Check className="h-4 w-4 text-success" />
                        )}
                        {searchQuery && !selectedAddress && !loading && (
                            <X
                                className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer"
                                onClick={clearSelection}
                                aria-label="Effacer la recherche"
                            />
                        )}
                    </div>
                </div>

                {showDropdown && addresses.length > 0 && (
                    <div
                        ref={dropdownRef}
                        className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-lg z-50 max-h-48 overflow-y-auto"
                        role="listbox"
                        aria-label="Liste des adresses"
                    >
                        {addresses.map((address: Address, index: number) => (
                            <div
                                key={address.id || index}
                                onClick={() => handleAddressSelect(address)}
                                className="px-4 py-3 hover:bg-muted cursor-pointer flex items-center space-x-3 border-b border-border/50 last:border-b-0"
                                role="option"
                                aria-selected={selectedAddress?.id === address.id}
                            >
                                <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                                <span className="text-sm flex-1 truncate">{address.label}</span>
                                {selectedAddress?.id === address.id && (
                                    <Check className="h-4 w-4 text-success flex-shrink-0" />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdressSearchInput;