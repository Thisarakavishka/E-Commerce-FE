import React, { useState } from "react"
import { ArrowRight, ShoppingBag, Heart, Eye } from 'lucide-react'
import { Link } from "react-router-dom"

const HomePage = () => {


    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative bg-black text-white">
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src="/placeholder.svg?height=800&width=1600"
                        alt="Hero background"
                        className="w-full h-full object-cover opacity-60"
                    />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 py-32 sm:px-6 lg:px-8 flex flex-col items-start">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
                        THE DARK KNIGHT<br />COLLECTION
                    </h1>
                    <p className="text-lg md:text-xl max-w-xl mb-8">
                        Embrace the shadows with our exclusive Batman-inspired clothing line.
                        Bold designs for those who stand for justice.
                    </p>
                    <Link
                        to="/shop"
                        className="bg-white text-black px-8 py-3 rounded-none font-medium hover:bg-gray-200 transition-colors inline-flex items-center"
                    >
                        SHOP NOW <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default HomePage
