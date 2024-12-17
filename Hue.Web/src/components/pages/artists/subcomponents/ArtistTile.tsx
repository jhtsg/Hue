import { useNavigate } from "react-router-dom";
import { artistImage } from "../../../../api/Artist";
import Artist from "../../../../model/artist/Artist";
import AvatarTile from "../../../shared/AvatarTile";
import SocialDisplay from "../../../shared/SocialDisplay";

export default function ArtistTile(props: {
    artist: Artist
    onClick?: (e: any) => void
    autoSize?: boolean
}) {

    const nav = useNavigate();
    const { artist, onClick, autoSize } = props;

    return <AvatarTile
        width={autoSize ? undefined : 280}
        avatarSize={48}
        avatarUrl={artistImage(artist.id)}
        onClick={onClick ? onClick : () => nav(`/artists/${artist.id}`)}
        avatarString={artist.name}
        hasImage={artist.hasImage}
    >
        <div>{artist.name}</div>
        <div><SocialDisplay url={artist.socialUrl} /></div>
    </AvatarTile>

}