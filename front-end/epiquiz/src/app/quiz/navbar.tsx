import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Quizzes from './quizzes';
import Rooms from './rooms';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function BasicTabs() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                    textColor='inherit'
                >
                    <Tab
                        label="Quizzes"
                        {...a11yProps(0)}
                        sx={{ color: 'white' }}
                    />
                    <Tab
                        label="Rooms"
                        {...a11yProps(1)}
                        sx={{ color: 'white' }}
                    />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <Quizzes />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <Rooms />
            </CustomTabPanel>
        </Box>
    );
}