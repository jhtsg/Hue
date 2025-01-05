# Hue

![Kanban](https://raw.githubusercontent.com/jhtsg/jhtsg/refs/heads/main/screenshots/kanban.png)

Hue is a commission management application meant to make it easy to manage and track commissions. Hue centralizes and links artists, characters, and commission information, making it easy to view trends and see statistics for all of your pieces.

## All in one place
![A commission](https://raw.githubusercontent.com/jhtsg/jhtsg/refs/heads/main/screenshots/commission.png)

A Commission is the biggest unit in Hue, which ties together several fields:

- General information like a name, description, status, and type
- Start and end of work dates
- Publishing information like date, tags, post body, and URL
- Artist that worked on the piece, and the cost and number of characters drawn
    - This is stored separately from the list of characters to allow for multiples of a character, or generic characters that aren't tracked
- Characters depicted
- Associated commission tags

Associated entities include and contain
- The Artist
    - Social link (Twitter, BlueSky, etc.)
    - Commission Price Sheet Link
- The Character
    - Associated Character Tag
    - Description and Species
- The Tag
    - Name and Description

## Powerful Statistics
![Stats](https://raw.githubusercontent.com/jhtsg/jhtsg/refs/heads/main/screenshots/statistics.png)

Hue's main focus is linking this information to extract powerful statistics and insights into your commissioning habits, and your artists' performance. Hue's dashboard shows you your monthly spending, and how your commissions have progressed. Hue can also break down your commissions and spending by artist, characters, or tags. You can also go further in depth with each artist and character:

<table>
    <thead>
        <tr>
            <td style="width: 50%;"><b>Artist</b></td>
            <td style="width: 50%;"><b>Character</b></td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <img src="https://raw.githubusercontent.com/jhtsg/jhtsg/refs/heads/main/screenshots/artistStatistics.png"/>
            </td>
            <td>
                <img src="https://raw.githubusercontent.com/jhtsg/jhtsg/refs/heads/main/screenshots/charStatistics.png"/>
            </td>
        </tr>
        <tr>
            <td>
                <ul>
                    <li>Types of Commissions</li>
                    <li>Cumulative Spending</li>
                    <li>Completion Times Over Dates</li>
                    <li>Characters Drawn</li>
                    <li>Tags Drawn</li>
                </ul>
            </td>
            <td>
                <ul>
                    <li>Types of Commissions</li>
                    <li>Cumulative Spending</li>
                    <li>Times drawn by an Artist</li>
                    <li>Tags in Commissions Appeared</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>

### For Clients and Artists
Hue also works for artists! Simply specify that you're an artist when registering and Hue will adjust accordingly. You'll be able to track your earnings and your clients with ease in just the same way.

## Setup

### 1. Choose How To Start
Hue comes in two varieties for set up.

#### Packaged Docker File
Hue comes conveniently wrapped in a Docker container for both the backend and the frontend. It's available here through Github's repository or through Docker's (JHTSG/hue:latest). This is the best approach if you plan to host it yourself, or if you're able to host with a paid hosting provider.

*The Docker container exposes port 9080. Configure your docker-compose to route accordingly.*

#### Split Backend/Frontend
Hue also can be wrapped separately. There is a separate dockerfile for a Docker backend. This is more helpful if you want to host the frontend on Vercel, and the backend on a free provider like Render. Just make a fork from this repo to get started.

### 2. Set up your DB
![DDL (No Views)](https://raw.githubusercontent.com/jhtsg/jhtsg/refs/heads/main/screenshots/diagram.png)
Hue does not come bundled with a DB so you can choose your own provider. It expects a DB URL in your environment, but we'll get to that later.

#### 2.A: Choose a Provider
Hue expects a PostgreSQL or compatible DB (like CockroachDB). If you plan to self-host, we recommend a PostgreSQL DB which can be downloaded from [their site](https://www.postgresql.org/download/). If you plan to host online, you can use any PostgreSQL provider, or a [free CockroachDB cluster](https://cockroachlabs.cloud/).

_Hue is a relatively DB intensive application, so be wary_

#### 2.B: Apply the DDLs
Hue expects a few tables and views present in your DB under the schema `hue`. Apply the three SQL files present under Hue.Data/DDLs in the following order:

1. Schema.sql
2. Tables.sql
3. Views.sql

Afterwards just set up a role for your Hue instance. Ensure the role has correct permissions for all tables, views, and the schema.

### 3. Set the Environment Variables
There's a couple of environment variables Hue expects:

|Name|Required|Sample Value|Desc|
|-|-|-|-|
|`DB_URL`|Y|```Host=localhost:5432; Database=hue; Username=hue; Password=1234;```|Connection string to your DB|
|`FRONTEND_HOST_NAME`|N|`slimeguy.net`|The host of Hue's frontend. Only needed if Hue's frontend is on a separate hostname so we can CORS |
|`IMAGE_CACHE_TIMESPAN`|N|`60`|Sliding timespan in minutes for images cached in memory|
|`SESSION_MEMORY_TIMESTAMP_MINUTES`|N|`10`|Sliding timespan in minutes for sessions kept cached in memory|
|`SESSION_DB_TIMESTAMP_DAYS`|N|`7`|Sliding timespan in days for sessions kept in database|
|`NO_SECURE`|N|`true`|Hue can disable sending the session cookie as Secure in case you're hosting locally and using HTTP²|
|`REGISTER_KEY`|N³|Anything| A passkey to allow users to register to this instance|

<div style="margin-bottom:20px">² Using NO_SECURE disables a secure cookie, meaning authentication breaks if CORS is required. If you disable this, make sure you're hosting the frontend and backend on the same hostname!</div>
<div style="margin-bottom:20px">³ An unset REGISTER_KEY will make registration unavailable. If you want this un-set, you should register yourself first, then un-set it.</div>

Additionally if you're hosting Hue's frontend on another provider, make sure to set the following environment variables

|Name|Required|Sample Value|Desc|
|-|-|-|-|
|`VITE_BACKEND_URL`|Y|`https://hueapi.slimeguy.net`|Backend URL so the frontend knows where to connect to|

### 4. Launch and Register Yourself
Once you've got this set up, you can set up and connect to your new instance! Hue's registration OOBE should guide you from here.

**Remember, if you're using the wrapped container, it exposes port 9080!**
