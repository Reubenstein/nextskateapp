'use client'
import HiveClient from "@/lib/hive/hiveclient";
import { Link } from "@chakra-ui/next-js";
import { Avatar, SystemStyleObject } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";

interface AuthorAvatarProps {
    username: string;
    borderRadius?: number;
    hover?: SystemStyleObject;
}

// Create a cache object to store profile images
const profileImageCache: { [key: string]: string } = {};

export default function AuthorAvatar({ username, borderRadius, hover }: AuthorAvatarProps) {
    const [profileImage, setProfileImage] = useState("");

    const fetchData = useMemo(() => {
        const fetchProfileImage = async () => {
            if (profileImageCache[username]) {
                setProfileImage(profileImageCache[username]);
            } else {
                const hiveClient = HiveClient;
                const userData = await hiveClient.database.getAccounts([String(username)]);

                if (userData.length > 0) {
                    const metadata = userData[0].json_metadata ? JSON.parse(userData[0].json_metadata) : {};
                    const profileImageUrl = metadata.profile?.profile_image;
                    profileImageCache[username] = profileImageUrl;
                    setProfileImage(profileImageUrl);
                }
            }
        };

        fetchProfileImage();
    }, [username]);

    useEffect(() => {
        fetchData;
    }, [fetchData]);

    return (
        <Link href={`/skater/${username}`}>
            {/* <Tooltip
                label={username}
                bg={"black"}
                color={"#A5D6A7"}
                border={"1px dashed #A5D6A7"}
            > */}
            <Avatar
                name={username}
                src={profileImage || `https://images.ecency.com/webp/u/${username}/avatar/small`}
                boxSize={12}
                bg="transparent"
                loading="lazy"
                borderRadius={borderRadius || 5}
                _hover={hover || { transform: "scale(1.05)", cursor: "pointer" }}
            />
            {/* </Tooltip> */}
        </Link>
    );
}
