import { useWindowDimensions } from "../../../hooks/useWindowDimensions";
import ArtistsStatisticsPane from "./subcomponents/ArtistsStatisticsPane";
import AtAGlancePane from "./subcomponents/AtAGlancePane";
import CharactersStatisticsPane from "./subcomponents/CharactersStatisticsPane";
import MonthlyStatisticsPane from "./subcomponents/MonthlyStatisticsPane";
import TagsStatisticsPane from "./subcomponents/TagsStatisticsPane";

export default function StatisticsPane(props: {
    year: number
}) {

    const { year } = props;
    const { vertical } = useWindowDimensions();

    return <>

        <div style={{ marginBottom: '20px' }}>
            <AtAGlancePane year={year} />
        </div>

        <MonthlyStatisticsPane year={year} />

        <div style={vertical ? { marginBottom: "20px" } : { display: "flex", marginBottom: "20px" }}>
            <div style={vertical ? { marginBottom: "20px" } : { flex: "1", marginRight: "10px" }}>
                <ArtistsStatisticsPane year={year} />
            </div>
            <div style={vertical ? undefined : { flex: "1", marginLeft: "10px" }}>
                <CharactersStatisticsPane year={year} />
            </div>
        </div>

        <TagsStatisticsPane year={year} />

    </>

}