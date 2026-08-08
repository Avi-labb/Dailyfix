import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

        if (!accessToken) {
            console.error("❌ Instagram API: INSTAGRAM_ACCESS_TOKEN is not set in .env");
            return res.status(400).json({
                success: false,
                error: "Instagram access token not configured",
                posts: []
            });
        }

        const url =
          `https://graph.instagram.com/me/media` +
          `?fields=id,caption,media_url,permalink,media_type,thumbnail_url,timestamp` +
          `&access_token=${accessToken}`;

        console.log("📸 Fetching Instagram posts from Graph API...");

        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("❌ Instagram API Error:", data.error);
            return res.status(400).json({
                success: false,
                error: data.error.message || "Failed to fetch Instagram posts",
                posts: []
            });
        }

        if (!data.data || !Array.isArray(data.data)) {
            console.error("❌ Instagram API: Unexpected response format", data);
            return res.status(500).json({
                success: false,
                error: "Unexpected response format from Instagram API",
                posts: []
            });
        }

        const posts = data.data.slice(0, 3).map(post => ({
            id: post.id,
            caption: post.caption || "",
            media_url: post.media_type === "VIDEO" ? (post.thumbnail_url || post.media_url) : post.media_url,
            permalink: post.permalink,
            media_type: post.media_type,
            thumbnail_url: post.thumbnail_url || null,
            timestamp: post.timestamp || null
        }));

        console.log(`✅ Instagram API: Successfully fetched ${posts.length} posts`);

        res.json({
            success: true,
            posts: posts
        });

    } catch (err) {
        console.error("❌ Instagram API Server Error:", err.message);
        res.status(500).json({
            success: false,
            error: "Server error while fetching Instagram posts",
            details: err.message,
            posts: []
        });
    }
});

export default router;