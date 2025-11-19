// Mock review data
const mockReviews = [
  {
    id: 7453,
    type: 'host-to-guest',
    status: 'published',
    rating: null,
    publicReview: "Shane and family are wonderful! Would definitely host again :)",
    reviewCategory: [
      { category: "cleanliness", rating: 10 },
      { category: "communication", rating: 10 },
      { category: "respect_house_rules", rating: 10 }
    ],
    submittedAt: "2024-01-18 22:45:14",
    guestName: "Shane Finkelstein",
    listingName: "2B N1 A - 29 Shoreditch Heights"
  },
  {
    id: 7454,
    type: 'guest-to-host',
    status: 'published',
    rating: null,
    publicReview: "Great location and very clean apartment. The host was extremely responsive.",
    reviewCategory: [
      { category: "cleanliness", rating: 9 },
      { category: "communication", rating: 10 },
      { category: "location", rating: 10 },
      { category: "checkin", rating: 8 }
    ],
    submittedAt: "2024-01-17 14:30:00",
    guestName: "Maria Rodriguez",
    listingName: "Downtown Luxury Suite - Airbnb"
  },
  {
    id: 7455,
    type: 'guest-to-host',
    status: 'draft',
    rating: null,
    publicReview: "The apartment was nice but the WiFi was slow for remote work.",
    reviewCategory: [
      { category: "cleanliness", rating: 8 },
      { category: "communication", rating: 7 },
      { category: "amenities", rating: 6 },
      { category: "value", rating: 8 }
    ],
    submittedAt: "2024-01-16 11:20:00",
    guestName: "James Wilson",
    listingName: "City Center Studio - Booking.com"
  },
  {
    id: 7456,
    type: 'host-to-guest',
    status: 'published',
    rating: null,
    publicReview: "Excellent guests! Very clean and respectful of house rules.",
    reviewCategory: [
      { category: "cleanliness", rating: 10 },
      { category: "communication", rating: 9 },
      { category: "respect_house_rules", rating: 10 }
    ],
    submittedAt: "2024-01-15 09:45:00",
    guestName: "Sarah Johnson",
    listingName: "Beachfront Villa - VRBO"
  }
];

// Normalize review data function
const normalizeReviews = (reviews) => {
  return reviews.map(review => {
    const categories = review.reviewCategory.reduce((acc, category) => {
      acc[category.category] = category.rating;
      return acc;
    }, {});

    const ratings = review.reviewCategory.map(cat => cat.rating);
    const overallRating = ratings.length > 0 
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
      : 0;

    // Determine channel from listing name
    let channel = 'direct';
    const name = review.listingName.toLowerCase();
    if (name.includes('airbnb')) channel = 'airbnb';
    if (name.includes('booking')) channel = 'booking.com';
    if (name.includes('vrbo')) channel = 'vrbo';

    return {
      id: review.id,
      type: review.type,
      status: review.status,
      overallRating: parseFloat(overallRating.toFixed(1)),
      publicReview: review.publicReview,
      categories,
      submittedAt: review.submittedAt,
      guestName: review.guestName,
      listingName: review.listingName,
      channel,
      isApproved: review.status === 'published'
    };
  });
};

// Controller functions
export const getHostawayReviews = async (req, res) => {
  try {
    console.log('Fetching Hostaway reviews...');
    
    const normalizedReviews = normalizeReviews(mockReviews);
    
    res.json({
      status: 'success',
      data: normalizedReviews,
      total: normalizedReviews.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error in getHostawayReviews:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch reviews'
    });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const normalizedReviews = normalizeReviews(mockReviews);
    
    const totalReviews = normalizedReviews.length;
    const averageRating = totalReviews > 0 
      ? normalizedReviews.reduce((sum, review) => sum + review.overallRating, 0) / totalReviews 
      : 0;
    const approvedReviews = normalizedReviews.filter(review => review.isApproved).length;
    const approvalRate = totalReviews > 0 ? (approvedReviews / totalReviews) * 100 : 0;

    const channelDistribution = normalizedReviews.reduce((acc, review) => {
      acc[review.channel] = (acc[review.channel] || 0) + 1;
      return acc;
    }, {});

    res.json({
      status: 'success',
      data: {
        totalReviews,
        averageRating: parseFloat(averageRating.toFixed(1)),
        approvalRate: parseFloat(approvalRate.toFixed(1)),
        approvedReviews,
        channelDistribution
      }
    });
    
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch dashboard statistics'
    });
  }
};

export const updateReviewStatus = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { isApproved } = req.body;
    
    console.log(`Updating review ${reviewId} status to:`, isApproved);
    
    // In a real app, you'd update this in your database
    // For mock purposes, we'll just return success
    
    res.json({
      status: 'success',
      message: `Review ${reviewId} ${isApproved ? 'approved' : 'rejected'}`,
      data: { 
        reviewId: parseInt(reviewId), 
        isApproved,
        updatedAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Error in updateReviewStatus:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update review status'
    });
  }
};

export const getGoogleResearch = async (req, res) => {
  try {
    res.json({
      status: 'success',
      data: {
        message: 'Google Reviews integration research findings',
        feasibility: 'Technically possible but requires significant setup',
        requirements: [
          'Google Cloud Project with billing enabled',
          'Places API enabled and configured',
          'Valid API key with billing setup',
          'Place IDs for each property'
        ],
        limitations: [
          'API costs: ~$32 per 1000 requests',
          'Cannot modify or delete Google reviews',
          'Limited to 5 reviews per API call'
        ],
        recommendation: 'Consider as phase 2 enhancement'
      }
    });
  } catch (error) {
    console.error('Error in getGoogleResearch:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch Google research'
    });
  }
};