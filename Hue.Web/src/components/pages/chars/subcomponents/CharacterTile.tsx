import { useNavigate } from "react-router-dom";
import AvatarTile from "../../../shared/AvatarTile";
import Character from "../../../../model/character/Character";
import { characterImage } from "../../../../api/Char";
import { Box } from "@mui/material";
import CharacterCategoryPill from "./CharacterCategoryPill";

export default function CharacterTile(props: {
    character: Character
    avatarSize?: number
    autoSize?: boolean
    onClick?: () => void
}) {

    const nav = useNavigate();
    const { character, autoSize, avatarSize, onClick } = props;

    return <AvatarTile
        width={autoSize ? undefined : 340}
        avatarSize={avatarSize ?? 64}
        avatarUrl={characterImage(character.id)}
        onClick={() => onClick ? onClick() : nav(`/characters/${character.id}`)}
        avatarString={character.name}
        hasImage={character.hasImage}
    >
        <div style={{ marginBottom: "7px", display: "flex" }}>
            <div style={{ padding: "5px", backgroundColor: character.color, borderRadius: "2px", marginRight: "7px" }} />
            <div>{character.name}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
            {character.category && <Box style={{ marginRight: "10px", cursor: "pointer" }}>
                <CharacterCategoryPill category={character.category} />
            </Box>}
            <div style={{ fontSize: ".8em", color: "#999999" }}>{character.species}</div>
        </div>
    </AvatarTile>

}