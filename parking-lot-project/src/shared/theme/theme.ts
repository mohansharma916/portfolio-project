import { createTheme } from "@mui/material/styles";

export const theme = createTheme({

    palette:{

        mode:"dark",

        // primary:{
        //     main:"#3B82F6",
        // },

        success:{
            main:"#22C55E",
        },

        error:{
            main:"#EF4444",
        },

        warning:{
            main:"#EAB308",
        },

        background:{
            default:"#303131",
        },

    },

    shape:{
        borderRadius:12,
    },

    typography:{
        fontFamily:"Inter",
    },

});