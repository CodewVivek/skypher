import React from 'react'
import {
    EmailIcon,
    EmailShareButton, FacebookIcon, FacebookShareButton, LinkedinIcon, LinkedinShareButton, WhatsappIcon, WhatsappShareButton,
} from "react-share";


const Share = () => {
    const shareUrl = 'https://yourwebsite.com';
    const title = 'Check this out!';

    return (
        <div>
            <EmailShareButton>
                <EmailIcon size={32} round />
            </EmailShareButton>

            <FacebookShareButton>
                <FacebookIcon size={32} round />
            </FacebookShareButton>

            <LinkedinShareButton url={shareUrl} title={title}>
                <LinkedinIcon size={32} round />
            </LinkedinShareButton>

            <WhatsappShareButton url={shareUrl} title={title}>
                <WhatsappIcon size={32} round />
            </WhatsappShareButton>

        </div>
    )
}

export default Share
