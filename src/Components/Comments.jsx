import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import ReportModal from './ReportModal';

// Helper to show relative time (e.g., '1h ago', '2d ago', 'just now')
function getRelativeTime(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diff = Math.floor((now - date) / 1000); // in seconds
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString();
}

const Comments = ({ projectId }) => {
    const [comments, setComments] = useState([]);
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null); // for admin
    const [newComment, setNewComment] = useState('');
    const [replyTo, setReplyTo] = useState(null);
    const [replyContent, setReplyContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [openReplies, setOpenReplies] = useState({}); // { [commentId]: true/false }
    const [reporting, setReporting] = useState(null); // commentId being reported
    const [reportReason, setReportReason] = useState('');
    const [reportSuccess, setReportSuccess] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportCommentId, setReportCommentId] = useState(null);

    useEffect(() => {
        fetchComments();
        checkUser();
        // eslint-disable-next-line
    }, [projectId]);

    const fetchComments = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('comments')
            .select('*, profiles(full_name, avatar_url)')
            .eq('project_id', projectId)
            .order('created_at', { ascending: true });
        if (!error) setComments(data);
        setLoading(false);
    };

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        if (user) {
            // Fetch user role for admin check
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();
            setUserRole(profile?.role);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!user || !newComment.trim()) return;
        await supabase.from('comments').insert({
            project_id: projectId,
            user_id: user.id,
            content: newComment,
            parent_id: null,
            deleted: false
        });
        setNewComment('');
        fetchComments();
    };

    // Soft delete: if has replies, mark as deleted; else, delete
    const handleDelete = async (comment) => {
        if (comment.replies && comment.replies.length > 0) {
            // Soft delete: update content and set deleted flag
            await supabase.from('comments').update({ content: '', deleted: true }).eq('id', comment.id);
        } else {
            // Hard delete
            await supabase.from('comments').delete().eq('id', comment.id);
        }
        fetchComments();
    };

    // Admin can delete any comment
    const handleAdminDelete = async (comment) => {
        if (comment.replies && comment.replies.length > 0) {
            await supabase.from('comments').update({ content: '', deleted: true }).eq('id', comment.id);
        } else {
            await supabase.from('comments').delete().eq('id', comment.id);
        }
        fetchComments();
    };

    const handleReply = async (parentId) => {
        if (!user || !replyContent.trim()) return;
        await supabase.from('comments').insert({
            project_id: projectId,
            user_id: user.id,
            content: replyContent,
            parent_id: parentId,
            deleted: false
        });
        setReplyTo(null);
        setReplyContent('');
        fetchComments();
    };

    // Helper to nest replies
    const nestComments = (comments) => {
        const map = {};
        comments.forEach(c => (map[c.id] = { ...c, replies: [] }));
        const roots = [];
        comments.forEach(c => {
            if (c.parent_id) {
                map[c.parent_id]?.replies.push(map[c.id]);
            } else {
                roots.push(map[c.id]);
            }
        });
        return roots;
    };

    const toggleReplies = (commentId) => {
        setOpenReplies(prev => ({ ...prev, [commentId]: !prev[commentId] }));
    };

    const renderComments = (comments, level = 0) => (
        comments.map(comment => {
            const hasReplies = comment.replies && comment.replies.length > 0;
            const repliesOpen = openReplies[comment.id];
            const isDeleted = comment.deleted;
            return (
                <div key={comment.id} className={`mb-2 ${level > 0 ? 'pl-8 border-l-2 border-blue-100' : ''}`} style={{ marginLeft: level > 0 ? `${level * 12}px` : 0 }}>
                    <div className="flex items-start gap-3 group relative">
                        <img src={comment.profiles?.avatar_url || '/default-avatar.png'} alt="avatar" className="w-8 h-8 rounded-full object-cover mt-1" />
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="font-semibold text-gray-800 text-sm">{comment.profiles?.full_name || 'User'}</span>
                                <span className="text-xs text-gray-400">{getRelativeTime(comment.created_at)}</span>
                            </div>
                            {isDeleted ? (
                                <p className="italic text-gray-400 text-sm mb-1">This comment was deleted.</p>
                            ) : (
                                <p className="text-gray-800 text-sm mb-1 break-words whitespace-pre-line">{comment.content}</p>
                            )}
                            <div className="flex gap-3 items-center text-xs">
                                {!isDeleted && user && (
                                    <button className="text-blue-500 font-medium hover:underline" onClick={() => setReplyTo(comment.id)}>
                                        Reply
                                    </button>
                                )}
                                {!isDeleted && user && (user.id === comment.user_id || userRole === 'admin') && (
                                    <button className="text-red-500 font-medium hover:underline" onClick={() => (userRole === 'admin' ? handleAdminDelete(comment) : handleDelete(comment))}>
                                        Delete
                                    </button>
                                )}
                                {!isDeleted && user && user.id !== comment.user_id && (
                                    <button className="text-yellow-600 font-medium hover:underline" onClick={() => { setReportCommentId(comment.id); setIsReportModalOpen(true); }}>
                                        Report
                                    </button>
                                )}
                                {hasReplies && (
                                    <button
                                        className="text-gray-500 font-medium hover:underline ml-2"
                                        onClick={() => toggleReplies(comment.id)}
                                    >
                                        {repliesOpen ? `Hide replies (${comment.replies.length})` : `Show replies (${comment.replies.length})`}
                                    </button>
                                )}
                            </div>
                            {replyTo === comment.id && !isDeleted && (
                                <form onSubmit={e => { e.preventDefault(); handleReply(comment.id); }} className="mt-2 flex gap-2 items-center">
                                    <input
                                        type="text"
                                        value={replyContent}
                                        onChange={e => setReplyContent(e.target.value)}
                                        placeholder="Write a reply..."
                                        className="border rounded px-2 py-1 w-64 focus:ring-2 focus:ring-blue-400 text-sm"
                                    />
                                    <button type="submit" className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">Reply</button>
                                    <button type="button" className="text-xs text-gray-500 hover:underline" onClick={() => setReplyTo(null)}>Cancel</button>
                                </form>
                            )}
                            {hasReplies && repliesOpen && (
                                <div className="mt-2">
                                    {renderComments(comment.replies, level + 1)}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="border-b border-gray-100 mt-2" />
                </div>
            );
        })
    );

    return (
        <div className="">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Comments</h3>
            {user ? (
                <form onSubmit={handleAddComment} className="mb-6 flex gap-2 items-center">
                    <img src={user?.user_metadata?.avatar_url || '/default-avatar.png'} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                    <input
                        type="text"
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 text-sm"
                    />
                    <button type="submit" className="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">Post</button>
                </form>
            ) : (
                <p className="text-sm text-gray-500 mb-6">Sign in to comment.</p>
            )}
            <div>
                {loading ? <div className="text-gray-400">Loading comments...</div> : (
                    renderComments(nestComments(comments))
                )}
            </div>
            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => { setIsReportModalOpen(false); setReportCommentId(null); }}
                commentId={reportCommentId}
            />
        </div>
    );
};

export default Comments; 