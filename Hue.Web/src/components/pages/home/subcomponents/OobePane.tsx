import { Card, CardActionArea, CardContent, CircularProgress, Link } from "@mui/material";
import SafeAvatar from "../../../shared/SafeAvatar";
import { useWindowDimensions } from "../../../hooks/useWindowDimensions";
import { ReactNode } from "react";
import { useUser } from "../../../hooks/useUser";
import { Check } from "@mui/icons-material";
import useApi, { Api } from "../../../hooks/useApi";
import { getCharacters } from "../../../../api/Char";
import { getArtists } from "../../../../api/Artist";
import Character from "../../../../model/character/Character";
import Artist from "../../../../model/artist/Artist";
import { useNavigate } from "react-router-dom";

export default function OobePane() {

    const { vertical, maxComponentHeight } = useWindowDimensions();
    const { user } = useUser();

    const charsApi = useApi(getCharacters, true);
    const artistApi = useApi(getArtists, true);

    return <div style={{
        display: "flex", gap: "20px", height: vertical ? undefined : `${maxComponentHeight + 20}px`,
        overflowY: "hidden", flexDirection: vertical ? "column" : undefined
    }}>
        <Card style={{ width: vertical ? undefined : "500px" }}>
            <CardContent style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <div style={{
                    backgroundImage: 'URL("/screenshots/statistics.png")',
                    backgroundRepeat: "no-repeat", backgroundSize: 'cover',
                    marginBottom: "20px"
                }}>
                    <div style={{
                        backgroundColor: "rgba(0,0,0,0.5)",
                        paddingTop: "160px", paddingLeft: "20px",
                        paddingBottom: "20px", fontSize: "2em"
                    }}>
                        Thanks for Registering!
                    </div>
                </div>
                <div style={{ flex: "1", overflowY: "auto" }}>
                    <p>
                        Welcome to your new home for commission management! I hope Hue shows its use to centralize all your data, and see insights and statistics into it.
                        I know it has been very useful for me!
                    </p>
                    <p>
                        I'm still developing this tool actively, so if you have
                        any feedback or ideas shoot me an email! <Link href="mailto:ian@slimeguy.net?subject=Hue">ian@slimeguy.net</Link>
                    </p>
                    <p>
                        <b>On the right are a few steps you can take to get started!</b>
                    </p>
                </div>
                <div>
                    <hr />
                    <p>
                        Again, thanks for trying out Hue!
                    </p>
                    <Card elevation={3}>
                        <CardActionArea href="https://the.slimeguy.net">
                            <div style={{ display: "flex", gap: "20px", alignItems: "center", padding: "10px" }}>
                                <SafeAvatar hasImage size={64} src="/ian.png" />
                                <div>
                                    <div style={{ fontSize: "1.4em" }}>Ian Adrianson</div>
                                    <div style={{ fontSize: ".8em", color: "#CCC" }}>The Slime Guy</div>
                                </div>
                            </div>
                        </CardActionArea>
                    </Card>

                </div>
            </CardContent>
        </Card>
        <div style={{ flex: "1", overflowY: "auto" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                {user?.isArtist ? <ArtistSteps artistsApi={artistApi} charsApi={charsApi} /> : <ClientSteps artistsApi={artistApi} charsApi={charsApi} />}
            </div>
        </div>
    </div >
}

function ClientSteps(props: {
    charsApi: Api<Character[]>
    artistsApi: Api<Artist[]>
}) {

    const { artistsApi, charsApi } = props

    return <>
        <OobeStep step={1} href="/characters"
            image="/screenshots/characterHeader.png" title="Register your first character"
            complete={charsApi.data?.length > 0} completeLoading={charsApi.loading}
        >
            Take the time to register one or all of your characters into Hue. Make sure to set a helpful category,
            and a headshot! All of this information can be edited later. Characters can also be created
            when you're writing up a commission just in case you get a bright idea for a new one mid creation process.
            As your focuses change, you can also retire unused characters so they don't bloat up your search while
            filling out the details of your next great piece.
        </OobeStep>
        <OobeStep step={2} href="/artists"
            image="/screenshots/artistHeader.png" title="Register your first artist"
            complete={artistsApi.data?.length > 0} completeLoading={artistsApi.loading}
        >
            Who's going to be your first artist to bring your vision to life? Anyone you've already worked with that
            you think you'll be commissioning again? Make sure they're here on Hue! Just like characters, you can also
            register an artist when editing a commission, just in case you find the perfect fit for that idea that's
            been milling about for some time. Also like characters, you can retire artists later to keep only your
            active ones visible when selecting one for your piece.
        </OobeStep>
        <OobeStep step={3} onClick={() => { }}
            image="/screenshots/primCharSelector.png" title="Set a primary character"
            complete={charsApi.data?.filter(a => a.isPrimary).length > 0} completeLoading={charsApi.loading}
        >
            This is a bit of an optional step, but you can set a character as your primary for your profile picture
            on the top right! Simply click on your user icon and select a character. The selector lets you create
            a character too if you haven't registered your own primary OC already.
        </OobeStep>
        <OobeStep step={4} href="/commissions"
            image="/screenshots/commHeader.png" title="Register your first commission"
        >
            Last step to get started is, of course, registering your first commission! You can start with either
            your current active pieces, or go through your back catalog to see more of Hue in action right now.

            <p>
                <b>Just a heads up! This welcome panel will disappear once there's at least one commission!</b>
            </p>

        </OobeStep>

    </>

}

function ArtistSteps(props: {
    charsApi: Api<Character[]>
    artistsApi: Api<Artist[]>
}) {

    const { artistsApi, charsApi } = props

    return <>
        <OobeStep step={1} href="/artists"
            image="/screenshots/artistHeader.png" title="Register your first client"
            complete={artistsApi.data?.length > 0} completeLoading={artistsApi.loading}
        >
            Who's going to be your first client? Who's vision will you first bring to life? Anyone you've already worked
            with that you think you'll be taking commissions from again? Make sure they're here on Hue!
            You can register an clients later too when editing a commission, so you can jot down all the
            details of your next work all in one place. You can also retire clients later to keep only your
            active ones visible when selecting one for your piece.
        </OobeStep>
        <OobeStep step={2} href="/characters"
            image="/screenshots/characterHeader.png" title="Register your first character"
            complete={charsApi.data?.length > 0} completeLoading={charsApi.loading}
        >
            Take the time to register one or all the characters you've worked on into Hue. Make sure to set a helpful category,
            and a headshot! All of this information can be edited later. Just like clients, characters can also be created
            when you're writing up a commission just in case your client has another for you to play with.
            You can also retire unused characters so they don't bloat up your search while
            filling out the details of your next great piece.
        </OobeStep>
        <OobeStep step={3} onClick={() => { }}
            image="/screenshots/primCharSelector.png" title="Set a primary character"
            complete={charsApi.data?.filter(a => a.isPrimary).length > 0} completeLoading={charsApi.loading}
        >
            This is a bit of an optional step, but you can set a character as your primary for your profile picture
            on the top right! Simply click on your user icon and select a character. The selector lets you create
            a character too if you haven't registered your own OC already.
        </OobeStep>
        <OobeStep step={4} href="/commissions"
            image="/screenshots/commHeader.png" title="Register your first commission"
        >
            Last step to get started is, of course, registering your first commission! You can start with either
            your current active pieces, or go through your back catalog to see more of Hue in action right now.

            <p>
                <b>Just a heads up! This welcome panel will disappear once there's at least one commission!</b>
            </p>

        </OobeStep>

    </>
}

function OobeStep(props: {
    step: number,
    title: string,
    image: string,
    complete?: boolean,
    completeLoading?: boolean
    children?: ReactNode,
    href?: string
    onClick?: () => void
}) {

    const { children, image, step, title, complete, completeLoading, href, onClick } = props
    const { width } = useWindowDimensions();
    const nav = useNavigate();
    const superVertical = width < 900

    return <Card style={{ width: superVertical ? undefined : "calc( 50% - 10px)", boxSizing: "border-box" }}>
        <CardActionArea style={{
            backgroundImage: `URL("${image}")`,
            backgroundRepeat: "no-repeat", backgroundSize: 'cover',
            backgroundPosition: "center"
        }} onClick={() => onClick ? onClick() : href ? nav(href) : console.warn("nope")}>
            <div style={{
                backgroundColor: "rgba(0,0,0,0.8)",
                paddingTop: "40px", paddingLeft: "20px",
                paddingBottom: "40px", fontSize: "1.4em",
                display: "flex", gap: "20px", alignItems: "center"
            }}>
                <div style={{
                    borderRadius: "5px", backgroundColor: complete ? "#292" : "#555",
                    color: "white", width: "40px", height: "40px",
                    display: "flex", alignItems: "center",
                    justifyContent: "center", transition: "background-color 500ms ease-in"
                }}>
                    {completeLoading ? <CircularProgress size={20} color="secondary" /> : complete ? <Check /> : step}
                </div>
                <div>
                    {title}
                </div>
            </div>


        </CardActionArea>
        <div style={{ padding: "20px", textAlign: "justify" }}>
            {children}
        </div>

    </Card>
}