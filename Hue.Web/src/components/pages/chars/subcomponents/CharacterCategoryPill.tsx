import CharacterCategory from "../../../../model/character/CharacterCategory";
import { Tooltip } from "@mui/material";

export default function CharacterCategoryPill(props: {
    category: CharacterCategory
}) {

    const { category } = props;

    return <Tooltip title={category.description}>
        <div style={{ borderRadius: '3px', fontSize: ".8em", padding: "2px 10px", backgroundColor: category.color }}>
            {category.name}
        </div>
    </Tooltip>

}