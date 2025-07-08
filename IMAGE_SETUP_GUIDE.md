# 🎬 Movie Images Setup Guide

## 📁 Folder Structure
Your images should be organized in the following structure:
```
public/
  images/
    posters/          # Movie poster images (400x600px recommended)
    actors/           # Actor profile images (square format recommended)
    movies/           # Movie backdrop/hero images (1200x600px recommended)
```

## 🔍 **Free & Legal Image Sources**

### 1. **TMDB (The Movie Database) API**
- **URL**: https://www.themoviedb.org/documentation/api
- **Free**: Yes (requires API key)
- **Legal**: Yes (for non-commercial use)
- **Quality**: High-resolution posters and backdrops
- **Setup**:
  ```bash
  # Get API key from TMDB
  # Search for movies: https://api.themoviedb.org/3/search/movie
  # Get images: https://api.themoviedb.org/3/movie/{id}/images
  ```

### 2. **Free Stock Photo Websites**
- **Unsplash**: https://unsplash.com (CC0 License)
- **Pexels**: https://pexels.com (Free for commercial use)
- **Pixabay**: https://pixabay.com (Free for commercial use)
- **Freepik**: https://freepik.com (Free with attribution)

### 3. **Creative Commons Sources**
- **Wikimedia Commons**: https://commons.wikimedia.org
- **Creative Commons Search**: https://search.creativecommons.org

## 📋 **Required Images for Your Project**

### Movie Posters (30 images needed)
Save these as `.jpg` files in `public/images/posters/`:

```
king-of-boys-3.jpg
anikulapo.jpg
the-black-book.jpg
gangs-of-lagos.jpg
citation.jpg
brotherhood.jpg
blood-covenant.jpg
jagun-jagun.jpg
tribe-called-judah.jpg
origin-madam-koi-koi.jpg
merry-men-3.jpg
progressive-tailors.jpg
ijakumo.jpg
water-man.jpg
namaste-wahala.jpg
elevator-baby.jpg
sugar-rush.jpg
living-in-bondage.jpg
muna.jpg
rattlesnake.jpg
quam-1982.jpg
milkmaid.jpg
ghost-and-tout-too.jpg
amina.jpg
eyimofe.jpg
seven-and-half-dates.jpg
man-of-god.jpg
ajosepo.jpg
ile-owo.jpg
breaded-life.jpg
```

### Actor Images (8 images needed)
Save these as `.jpg` files in `public/images/actors/`:

```
genevieve-nnaji.jpg
ramsey-nouah.jpg
funke-akindele.jpg
jim-iyke.jpg
mercy-johnson.jpg
richard-mofe-damijo.jpg
omotola-jalade.jpg
nkem-owoh.jpg
```

## 🛠 **Quick Setup Steps**

### Step 1: Download Images
1. Visit the free sources listed above
2. Search for Nigerian movie posters or create custom designs
3. Download images in appropriate sizes (400x600 for posters)

### Step 2: Organize Files
```bash
# Create the folder structure
mkdir -p public/images/posters
mkdir -p public/images/actors
mkdir -p public/images/movies

# Move your downloaded images to the correct folders
# Example:
mv ~/Downloads/king-of-boys-poster.jpg public/images/posters/king-of-boys-3.jpg
```

### Step 3: Verify Setup
The project will automatically use your local images if they exist, otherwise it falls back to placeholder URLs.

## ⚖️ **Legal Considerations**

### ✅ **Legal Options**:
- Images with CC0 license (Public Domain)
- Images with Creative Commons licenses (check attribution requirements)
- Stock photos marked as "Free for commercial use"
- TMDB API images (for non-commercial projects)
- Your own created/designed posters

### ❌ **Avoid**:
- Copyrighted movie posters without permission
- Images from Google Images without checking licenses
- Screenshots from movies without rights
- Official promotional materials without rights

## 🎨 **Image Specifications**

### Movie Posters
- **Format**: JPG or WebP
- **Size**: 400x600px (2:3 aspect ratio)
- **Quality**: High resolution for crisp display
- **File size**: < 500KB for optimal loading

### Actor Images
- **Format**: JPG or WebP
- **Size**: 400x400px (square)
- **Quality**: High resolution
- **File size**: < 300KB

## 🔄 **Alternative: Using TMDB API**

If you want to use real movie data, consider integrating with TMDB:

```typescript
// Example TMDB integration
const TMDB_API_KEY = 'your-api-key';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function getMoviePoster(movieTitle: string) {
  const response = await fetch(
    `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${movieTitle}`
  );
  const data = await response.json();
  return `https://image.tmdb.org/t/p/w400${data.results[0]?.poster_path}`;
}
```

## 📞 **Need Help?**

If you need assistance:
1. Check that file paths match exactly (case-sensitive)
2. Verify image formats are supported (jpg, png, webp)
3. Ensure images are in the correct folders
4. Check browser dev tools for 404 errors

Remember: Always respect copyright and licensing when using images! 🎬✨ 