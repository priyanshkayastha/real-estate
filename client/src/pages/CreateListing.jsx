import React from "react";

const CreateListing = () => {
  return (
    <main className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Create a Listing</h1>

      {/* 2-column grid on md and up */}
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column (inputs) */}
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-slate-300"
            id="name"
            maxLength="62"
            minLength="10"
            required
          />

          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg w-full h-32 resize-y focus:outline-none focus:ring-2 focus:ring-slate-300"
            id="description"
            required
          />

          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-slate-300"
            id="address"
            required
          />

          {/* Features + numbers grouped */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-4 items-center">
              <label className="flex items-center gap-2">
                <input type="checkbox" id="sale" className="w-5 h-5" />
                <span className="select-none">Sell</span>
              </label>

              <label className="flex items-center gap-2">
                <input type="checkbox" id="rent" className="w-5 h-5" />
                <span className="select-none">Rent</span>
              </label>

              <label className="flex items-center gap-2">
                <input type="checkbox" id="parking" className="w-5 h-5" />
                <span className="select-none">Parking Spot</span>
              </label>

              <label className="flex items-center gap-2">
                <input type="checkbox" id="furnished" className="w-5 h-5" />
                <span className="select-none">Furnished</span>
              </label>

              <label className="flex items-center gap-2">
                <input type="checkbox" id="offer" className="w-5 h-5" />
                <span className="select-none">Offer</span>
              </label>
            </div>

            {/* numeric inputs in a responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
              <div className="flex items-center gap-2">
                <input
                  className="p-3 border border-gray-300 rounded-lg w-24 text-center"
                  type="number"
                  id="bedrooms"
                  min="1"
                  max="10"
                  required
                />
                <p className="whitespace-nowrap">Beds</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  className="p-3 border border-gray-300 rounded-lg w-24 text-center"
                  type="number"
                  id="bathrooms"
                  min="1"
                  max="10"
                  required
                />
                <p className="whitespace-nowrap">Baths</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  className="p-3 border border-gray-300 rounded-lg w-36 text-center"
                  type="number"
                  id="regularPrice"
                  min="1"
                  required
                />
                <p className="whitespace-nowrap">Regular Price</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  className="p-3 border border-gray-300 rounded-lg w-36 text-center"
                  type="number"
                  id="discountPrice"
                  min="1"
                  required
                />
                <p className="whitespace-nowrap">Discounted Price</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column (images + submit) */}
        <div className="flex flex-col gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>

          {/* Styled file control (label + hidden input) */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="images"
              className="flex items-center justify-between gap-4 border p-3 rounded-lg cursor-pointer hover:shadow-sm"
            >
              <span className="text-sm truncate">Choose images (jpg, png) — up to 6</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M16 8l-4-4m0 0L8 8m4-4v12"/>
              </svg>
            </label>
            <input
              id="images"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
            />

            <div className="flex gap-3">
              <button
                type="button"
                className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
              >
                Upload
              </button>

              <button
                type="submit"
                className="p-3 bg-slate-700 text-white rounded-lg opacity-95 disabled:opacity-80"
              >
                Create Listing
              </button>
            </div>
          </div>

         
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
