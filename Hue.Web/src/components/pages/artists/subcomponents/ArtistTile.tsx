import { useNavigate } from "react-router-dom";
import { artistImage } from "../../../../api/Artist";
import Artist from "../../../../model/artist/Artist";
import AvatarTile from "../../../shared/AvatarTile";
import SocialDisplay from "../../../shared/SocialDisplay";

export default function ArtistTile(props: {
    artist: Artist
}) {

    const nav = useNavigate();
    const { artist } = props;

    return <AvatarTile
        width={280}
        avatarSize={64}
        avatarUrl={artistImage(artist.id)}
        onClick={() => nav(`/artists/${artist.id}`)}
        avatarString={artist.name}
    >
        <div>{artist.name}</div>
        <div><SocialDisplay url={artist.socialUrl} /></div>
    </AvatarTile>

}