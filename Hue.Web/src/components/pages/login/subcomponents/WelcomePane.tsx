import { Card, CardContent, CardHeader } from "@mui/material";
import { useWindowDimensions } from "../../../hooks/useWindowDimensions";

export default function WelcomePane() {

    const { width } = useWindowDimensions();
    const superVertical = width < 800

    return <Card>
        <div style={{
            backgroundImage: 'URL("/screenshots/kanban.png")',
            backgroundRepeat: "no-repeat", backgroundSize: 'cover'
        }}>
            <div style={{
                backgroundColor: "rgba(0,0,0,0.5)",
                paddingTop: "160px",
                paddingLeft: "20px",
                paddingBottom: "20px",
                fontSize: "2em"
            }}>
                Welcome to Hue!
            </div>
        </div>
        <div style={{ padding: "20px" }}>
            <div>
                Hue is your new home for commission management, planning, and tracking.
                See where your commissions stand in one easy board. Track the artists
                you've worked with, their works, and their prices. See your characters
                and how much you've commissioned for them. All in one place!
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", marginTop: "20px" }}>
                <WelcomeCard imageSrc="/screenshots/commission.png" title="Commission Tracking">
                    See your commissions as they progress through their Lifecycle. Take down
                    notes and brainstorm what your next big project is. Assign an artist and
                    schedule it. Once they're finished, publish them, and keep track of your
                    dates, tags, and descriptions.
                </WelcomeCard>
                <WelcomeCard title="Artist and Character Tracking" imageSrc="/screenshots/characters.png">
                    Who's the character you've commissioned the most? When was the last time
                    you commissioned your OC? How much have you commissioned this artist for?
                    All questions answerable by Hue's robust associations and tracking of
                    everything involved in your commissions
                </WelcomeCard>
                <WelcomeCard title="Powerful Statistics" imageSrc="/screenshots/statistics.png">
                    Beyond just individual artists, characters, and commissions, Hue gives you
                    broad statistics on a yearly  and overall time-frames. Track your spending
                    on a monthly basis. Find out your artists' average completion times. Or if
                    hue's statistics aren't enough, export your data to go even deeper.
                </WelcomeCard>
            </div>

            <div style={{ display: superVertical ? undefined : "flex", marginTop: "20px" }}>
                <div style={superVertical ? { marginBottom: "20px" } : { flex: "1", marginRight: "10px" }}>
                    <Card elevation={5}>
                        <CardHeader title="Works for Artists Too!" />
                        <CardContent>
                            Want to track your own work? Who your most frequent clients are? What
                            your monthly earnings are? Hue isn't just for commissioners; it works
                            for artists too! Just tick the box when you're registering.
                        </CardContent>
                    </Card>
                </div>
                <div style={superVertical ? {} : { flex: "1", marginLeft: "10px" }}>
                    <Card elevation={5}>
                        <CardHeader title="More to come!" />
                        <CardContent>
                            <div style={{
                                display: "flex"
                            }}>
                                <img src="/ian.png" height={64} style={{ marginRight: "20px" }} />
                                <div>
                                    Want to see new features? I value your feedback! We'll see how far I can
                                    take this XD. Thanks for stopping by and checking this out!<br /><br />
                                    -TSG
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

        </div>
    </Card >

}

function WelcomeCard(props: {
    imageSrc: string,
    title: string,
    children: any
}) {

    const { children, imageSrc, title } = props
    const { vertical } = useWindowDimensions();

    return <div style={{ flex: "1", minWidth: !vertical ? "300px" : "300px" }}>
        <Card elevation={7} style={{ margin: "10px" }}>
            <div style={{
                backgroundImage: `URL(${imageSrc})`, backgroundRepeat: "no-repeat", backgroundSize: 'cover',
            }}><div style={{
                backgroundColor: "rgba(0,0,0,0.5)",
                paddingTop: "140px", paddingLeft: "20px", paddingRight: "20px", paddingBottom: "5px",
                fontSize: "1.2em"
            }}>
                    {title}
                </div></div>
            <div style={{ padding: "20px" }}>
                {children}
            </div>
        </Card>
    </div>
}