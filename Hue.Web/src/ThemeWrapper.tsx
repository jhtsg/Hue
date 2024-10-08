import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

export default function ThemeWrapper(props: { children: any }) {

  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: { main: import.meta.env.VITE_THEME_PRIMARY_COLOR ?? '#559E55', },
      secondary: { main: import.meta.env.VITE_THEME_SECONDARY_COLOR ?? '#D1904B', },
    },
  })


  return <ThemeProvider theme={theme}>
    <CssBaseline />
    {props.children}
  </ThemeProvider>

}

