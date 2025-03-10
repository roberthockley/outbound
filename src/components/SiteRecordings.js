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
import { PlayIcon } from "@twilio-paste/icons/esm/PlayIcon";


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
    const [sortedData, setSortedData] = React.useState([]);
    const search = () => {
        if ((!dateEnd || !dateStart) || !phoneNumber) {
            toaster.push({
                message: `Get better results by searching for a number within a date range`,
                variant: 'warning',
                dismissAfter: 3000
            })
        } /*else if (!dateEnd && !dateStart) {
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
        }*/
        if (dateEnd && dateStart && phoneNumber) {
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
                let recordings = JSON.parse(localStorage.getItem('recordings'))
                console.log(recordings)
                const sort = recordings.sort((a, b) => {
                    return new Date(a.date) - new Date(b.date); // Ascending order
                });
                
                const filteredRecordings = sort.filter(recording => {
                    const recordingDate = new Date(recording.date);
                    return recordingDate >= start && recordingDate <= end;
                });
        
                const results = filteredRecordings.filter(recording => 
                    recording.phoneNumber.includes(phoneNumber)
                );

                // Update state with filtered and sorted data
                setSortedData(results);


                //setSortedData(sort);
            }
        }
    }
    const playList= () => {}
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
                    {sortedData.map((holiday, index) => (
                        <Tr key={"row" + index}>
                            <Td key={"date" + index}>{holiday.date}</Td>
                            <Td key={"time" + index}>{holiday.time}</Td>
                            <Td key={"phoneNumber" + index}>{holiday.phoneNumber}</Td>
                            <Td key={"recordingName" + index}>{holiday.recordingName}</Td>
                            <Td key={"button" + index} textAlign='left'><Button variant="secondary" size="small" onClick={() => { playList(prompt.engine, prompt.language, prompt.text, prompt.voice) }
                            }>
                                <PlayIcon title='test' />
                            </Button>
                            </Td>
                        </Tr>
                    ))}
                </TBody>
            </Table>
            <Toaster left={['space180', 'unset', 'unset']} {...toaster} />
        </Box>
    )
};