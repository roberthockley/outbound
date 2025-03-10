import { Combobox } from '@twilio-paste/core/combobox';
import React, { useEffect } from 'react';
import { Label, Box } from '@twilio-paste/core';
import { useToaster, Toaster } from '@twilio-paste/core/toast';
import { Heading } from '@twilio-paste/core/heading';
import { Button } from '@twilio-paste/core/button';
import { Input } from '@twilio-paste/core/input';
import { Table, THead, Tr, Td, Th, TBody } from '@twilio-paste/core/table';
import { DatePicker, formatReturnDate } from '@twilio-paste/core/date-picker';
import { useUID } from '@twilio-paste/core/uid-library';

const moment = require('moment');

let newData = []
let countryHolidays = []
let dateRanges = [
    ["All"]
];
let monthRanges = []
let filteredHolidays = []

export const SiteRecordings = () => {
    const uidDPS = useUID();
    const uidDPE = useUID();
    const uidDPN = useUID();
    const uidHT = useUID();
    const [inputItems, setInputItems] = React.useState(newData);
    const toaster = useToaster();
    const [dateStart, setDateStart] = React.useState(null);
    const [dateEnd, setDateEnd] = React.useState(null);
    const [phoneNumber, setPhoneNumber] = React.useState(null);
    const search = () => {
        console.log((!dateEnd && !dateStart) || !phoneNumber)
        console.log(!dateEnd && !dateStart)
        console.log(!phoneNumber)
        if ((!dateEnd && !dateStart) && !phoneNumber) {
            toaster.push({
                message: `Get better results by searching for a number within a date range`,
                variant: 'warning',
                dismissAfter: 3000
            })
        } else if (!dateEnd && !dateStart) {
            toaster.push({
                message: `Get better results by specifying a date range`,
                variant: 'warning',
                dismissAfter: 3000
            })
        } else if (!phoneNumber) {
            toaster.push({
                message: `Get better results by specifying a phone number`,
                variant: 'warning',
                dismissAfter: 3000
            })
        }
        const [startDay, startMonth, startYear] = dateStart.split("/");
        const [endDay, endMonth, endYear] = dateEnd.split("/");
        const start = new Date(`${startYear}-${startMonth}-${startDay}`);
        const end = new Date(`${endYear}-${endMonth}-${endDay}`);

        if (start > end) {
            toaster.push({
                message: `The start date must be before the end date`,
                variant: 'error',
                dismissAfter: 3000
            })
        } else {
            // Add your form submission logic here
        }
    }

    useEffect(() => {
        // setRecordings(JSON.parse(localStorage.getItem('recordings')))


    }, []);

    return (
        <Box style={{ width: '50%' }}>

            <Heading as="h1" variant="heading10">
                Verint Call Recordings
            </Heading>
            <div >
                <div style={{ display: "flex", gap: "30px" }}>
                    <span>
                        <Label htmlFor={uidDPS} >Start</Label>
                        <DatePicker required id={uidDPS} aria-describedby={uidHT} onChange={(evt) => setDateStart(formatReturnDate(evt.target.value, 'dd/MM/yyyy'))} />
                    </span>
                    <span>
                        <Label htmlFor={uidDPE} >End</Label>
                        <DatePicker Label="End" required id={uidDPE} aria-describedby={uidHT} onChange={(evt) => setDateEnd(formatReturnDate(evt.target.value, 'dd/MM/yyyy'))} />
                    </span>
                    <span>
                        <Label htmlFor={uidDPN} >Phone Number</Label>
                        <Input id="phoneNumber" name="phoneNumber" onChange={e => setPhoneNumber(e.currentTarget.value)}></Input>
                    </span>
                    <span>
                        <Label><span>&#8203;</span></Label>
                        <Button variant="primary" onClick={search}>Search</Button>
                    </span>
                </div>
            </div>
            <div><br /></div>
            <Table aria-label="holiday-grid" id="holiday-grid" striped="true" >
                <THead stickyHeader top={0}>
                    <Tr>
                        <Th >Date DD/MM/YYYY</Th>
                        <Th >Time</Th>
                        <Th >Phone Number</Th>
                        <Th> Recording Name</Th>
                        <Th> Play</Th>
                    </Tr>
                </THead>
                <TBody>
                    {filteredHolidays.map((holiday, index) => (
                        <Tr key={"row" + index}>
                            <Td key={"date" + index}>{holiday.date}</Td>
                            <Td key={"name" + index}>{holiday.name}</Td>
                            <Td key={"button" + index} textAlign='left'>
                            </Td>
                        </Tr>
                    ))}
                </TBody>
            </Table>
            <Toaster left={['space180', 'unset', 'unset']} {...toaster} />
        </Box>
    )
};