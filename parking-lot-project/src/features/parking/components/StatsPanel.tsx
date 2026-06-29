// StatsPanel.tsx

import {
    Paper,
    Stack,
    Typography,
} from "@mui/material";

function StatCard({
    title,
    value,
}: {
    title: string;
    value: string | number;
}) {
    return (
        <Paper
            elevation={3}
            sx={{
                p: 2,
            }}
        >
            <Typography
                variant="body2"
                color="text.secondary"
            >
                {title}
            </Typography>

            <Typography
                variant="h4"
            >
                {value}
            </Typography>
        </Paper>
    );
}

export default function StatsPanel() {
    return (
        <Stack
        sx={{width:260 }}
            spacing={2}
           
        >
            <StatCard
                title="Total Spots"
                value={12}
            />

            <StatCard
                title="Available"
                value={8}
            />

            <StatCard
                title="Occupied"
                value={4}
            />

            <StatCard
                title="Revenue"
                value="₹0"
            />
        </Stack>
    );
}