import React, { useState, useEffect } from "react";
import { Home, User, Download, Menu, Video, Bell } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";

const sidebarItems = [
    { icon: <Home />, label: "Home", to: "/" },
    { icon: <Video />, label: "Shorts", to: "/shorts" },
    { icon: <Bell />, label: "Subscriptions", to: "/subscriptions" },
    { icon: <User />, label: "You", to: "__profile__" },
    { icon: <Download />, label: "Downloads", to: "/downloads" },
];

const Sidebar = ({ open, onToggle }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getUserInfo = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (!error) setUser(user);
        };
        getUserInfo();
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        return () => subscription.unsubscribe();
    }, []);

    const handleProfileClick = async () => {
        if (user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('username')
                .eq('id', user.id)
                .single();
            if (profile && profile.username) {
                navigate(`/profile/${profile.username}`);
            } else {
                toast.error('Profile not found');
            }
        }
    };

    return (
        <aside
            className=
            {`fixed top-0 left-0 h-full z-40 bg-white border-r border-gray-200 transition-all duration-300 ${open ? "w-56" : "w-20"}`}
        >

            <div className="flex flex-col h-full">
                <button
                    className="flex items-center justify-center h-16 w-full border-b border-gray-100 hover:bg-gray-100 hover:rounded transition"
                    onClick={onToggle}
                    style={{ minHeight: 64 }}
                >
                    <Menu className="w-6 h-6" />
                </button>
                <nav className="flex-1 py-4 space-y-1">
                    {sidebarItems.map((item) =>
                        item.label === "You" ? (
                            <button
                                key={item.label}
                                onClick={handleProfileClick}
                                className="flex items-center gap-4 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors w-full"
                            >
                                <span className="w-6 h-6 flex items-center justify-center"><User /></span>
                                {open && <span className="text-base font-medium">You</span>}
                            </button>
                        ) : (
                            <Link
                                key={item.label}
                                to={item.to}
                                className="flex items-center gap-4 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                <span className="w-6 h-6 flex items-center justify-center">{item.icon}</span>
                                {open && <span className="text-base font-medium">{item.label}</span>}
                            </Link>
                        )
                    )}
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;