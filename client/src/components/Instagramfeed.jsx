import { useEffect, useState } from "react";
import { Instagram, Loader2 } from "lucide-react";
import api from "../services/api";

function InstagramFeed() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInstagramPosts = async () => {
            try {
                setLoading(true);
                setError(null);

                console.log("📸 Fetching Instagram posts...");
                const res = await api.get("/instagram");
                console.log("📸 Instagram API Response:", res.data);

                if (res.data && res.data.success && Array.isArray(res.data.posts)) {
                    setPosts(res.data.posts);
                } else if (Array.isArray(res.data)) {
                    setPosts(res.data);
                } else {
                    setPosts([]);
                    setError(res.data?.error || "Failed to load Instagram posts");
                }
            } catch (err) {
                console.error("❌ Error fetching Instagram posts:", err);
                setError(err.response?.data?.error || err.message || "Unable to load Instagram posts");
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchInstagramPosts();
    }, []);

    return (
        <section className="py-16 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-stone-50 to-white overflow-hidden">
            <div className="max-w-9xl mx-auto">
                <div className="text-center mb-10 sm:mb-14">
                    <div className="inline-flex items-center gap-2.5 bg-pink-50 text-pink-600 px-4 py-2 rounded-full border border-pink-100 mb-6">
                        <Instagram className="w-4 h-4" />
                        <span className="text-[11px] font-bold tracking-widest uppercase">Follow Our Journey</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight leading-none mb-4">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500">
                            @dailyfixcare
                        </span>
                    </h2>
                    <p className="text-stone-600 text-base sm:text-lg max-w-2xl font-medium mx-auto">
                        Stay updated with our latest grooming tips, product launches, and customer transformations.
                        Follow us on Instagram for daily inspiration.
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
                        <p className="text-stone-500 font-medium">Loading Instagram feed...</p>
                    </div>
                ) : error && posts.length === 0 ? (
                    <div className="text-center py-16 px-6 bg-white rounded-3xl border border-stone-200 shadow-sm">
                        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Instagram className="w-8 h-8 text-stone-400" />
                        </div>
                        <p className="text-stone-700 font-semibold text-lg mb-2">Instagram feed unavailable</p>
                        <p className="text-stone-500 text-sm mb-6 max-w-md mx-auto">
                            {error}
                        </p>
                        <a
                            href="https://www.instagram.com/dailyfixcare/"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white font-semibold px-6 py-3 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
                        >
                            <Instagram className="w-5 h-5" />
                            Visit Our Instagram
                        </a>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-stone-500">No Instagram posts available yet.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-10 max-w-7xl mx-auto">
                            {posts.map((post, index) => (
                                <a
                                    key={post.id}
                                    href={post.permalink || "https://www.instagram.com/dailyfixcare/"}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group relative aspect-square overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 bg-stone-100"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <img
                                        src={post.media_url}
                                        alt={post.caption || "Instagram post"}
                                        loading="lazy"
                                        className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.style.display = "none";
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400 translate-y-4 group-hover:translate-y-0">
                                        <Instagram className="w-8 h-8 text-white mb-2 drop-shadow-lg" />
                                        {post.media_type === "VIDEO" && (
                                            <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full p-1.5">
                                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    {post.caption && (
                                        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
                                            <p className="text-white text-xs sm:text-sm font-medium line-clamp-2 drop-shadow-lg">
                                                {post.caption.length > 100
                                                    ? post.caption.substring(0, 100) + "..."
                                                    : post.caption}
                                            </p>
                                        </div>
                                    )}
                                </a>
                            ))}
                        </div>

                       
                    </>
                )}
            </div>
        </section>
    );
}

export default InstagramFeed;