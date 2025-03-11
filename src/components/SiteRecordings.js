import React, { useEffect, useRef } from 'react';
import { Label, Box } from '@twilio-paste/core';
import { useToaster, Toaster } from '@twilio-paste/core/toast';
import { Heading } from '@twilio-paste/core/heading';
import { Button } from '@twilio-paste/core/button';
import { Input } from '@twilio-paste/core/input';
import { Table, THead, Tr, Td, Th, TBody } from '@twilio-paste/core/table';
import { DatePicker, formatReturnDate } from '@twilio-paste/core/date-picker';
import { useUID } from '@twilio-paste/core/uid-library';
import { PlayIcon } from "@twilio-paste/icons/esm/PlayIcon";
import ReactAudioPlayer from 'react-audio-player';
import axios from 'axios';

export const SiteRecordings = () => {
    const uidDPS = useUID();
    const uidDPE = useUID();
    const uidDPN = useUID();
    const uidHT = useUID();
    const audioRef = useRef(null);
    const [activeRow, setActiveRow] = React.useState(null); // Track which row's audio player is visible
    const toaster = useToaster();
    const [dateStart, setDateStart] = React.useState(null);
    const [dateEnd, setDateEnd] = React.useState(null);
    const [phoneNumber, setPhoneNumber] = React.useState(null);
    const [recordings, setRecordings] = React.useState(null);
    const [sortedData, setSortedData] = React.useState([]);
    const [presign, setPresign] = React.useState(null);
    let data = {}
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
                
                data.ani = phoneNumber
                data.startDate = start
                data.endDate = end
                data.searchType = "aniWithTime"
                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: `${process.env.REACT_APP_URL}`,
                    headers: {
                        'Content-Type': 'application/javascript'
                    },
                    data: data
                };
                console.log(config)
                axios.request(config)
                    .then((response) => {
                        console.log(response)
                        let recordingData = JSON.parse(response.data.body).data
                        for (let i = 0; i < recordingData.length; i++) {
                            const [datePart, timePartWithOffset] = recordingData[i].audiostarttime.split("T");
                            const timePart = timePartWithOffset.split("+")[0];
                            const [year, month, day] = datePart.split("-");
                            const formattedDate = `${day}/${month}/${year}`;
                            const formattedTime = timePart.split(".")[0];
                            recordingData[i].formattedDate = formattedDate
                            recordingData[i].formattedTime = formattedTime
                        }
                        setRecordings(recordingData)

                        const sort = recordingData.sort((a, b) => {
                            return new Date(a.audiostarttime) - new Date(b.audiostarttime); // Ascending order
                        });
                        console.log(sort)
                        const filteredRecordings = sort.filter(recording => {
                            const recordingDate = new Date(recording.audiostarttime);
                            return recordingDate >= start && recordingDate <= end;
                        });
                        console.log(filteredRecordings)
                        const results = filteredRecordings.filter(recording =>
                            recording.ani.includes(phoneNumber)
                        );
                        console.log(results)

                        // Update state with filtered and sorted data
                        setSortedData(results);


                        //setSortedData(sort);
                    })
                    .catch((error) => {
                        console.log(error);
                    });


            }
        }
    }
    const handlePlayClick = (index, filename) => {
        data.searchType = "presign"
        data.filename = filename
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${process.env.REACT_APP_URL}`,
            headers: {
                'Content-Type': 'application/javascript'
            },
            data: data
        };
        axios.request(config)
            .then((response) => {
                console.log(response)
                setPresign(response.data)
                console.log(response.data)
            })
            .catch((error) => {
                console.log(error);
            });
        setActiveRow(index); // Set the active row to the clicked index
    };

    useEffect(() => {
        //setRecordings(JSON.parse(localStorage.getItem('recordings')))


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
            <Table aria-label="file-grid" id="file-grid" striped="true" >
                <THead stickyHeader top={0}>
                    <Tr>
                        <Th >Date DD/MM/YYYY</Th>
                        <Th >Time</Th>
                        <Th >Phone Number</Th>
                        <Th >Direction</Th>
                        <Th >Agent</Th>
                        <Th >Queue</Th>
                        <Th> Recording Name</Th>
                        <Th> Play</Th>
                    </Tr>
                </THead>
                <TBody>
                    {sortedData.map((file, index) => (

                        <Tr key={"row" + index}>
                            <Td key={"date" + index}>{file.formattedDate}</Td>
                            <Td key={"time" + index}>{file.formattedTime}</Td>
                            <Td key={"phoneNumber" + index}>{file.ani}</Td>
                            <Td key={"direction" + index}>{file.extendedcallhistory}</Td>
                            <Td key={"agentName" + index}>{file.agentname}</Td>
                            <Td key={"queue" + index}>{file.virtual_queue}</Td>
                            <Td key={"recordingLocation" + index}>{file.filename}</Td>
                            <Td key={"button" + index} textAlign='left'><audio ref={audioRef} />{activeRow === index ? (
                                // Show Audio Player if this row is active
                                <ReactAudioPlayer
                                    src={presign}
                                    controls
                                    autoPlay
                                    style={{ marginTop: "10px", width: "300px" }}
                                    onEnded={() => setActiveRow(null)} // Reset when playback ends
                                />
                            ) : (
                                // Show Play Button if this row is not active
                                <Button
                                    variant="secondary"
                                    size="small"
                                    onClick={() => handlePlayClick(index, file.filename)}
                                >
                                    <PlayIcon title="play" />
                                </Button>
                            )}
                            </Td>
                        </Tr>
                    ))}
                </TBody>
            </Table>
            <Toaster left={['space180', 'unset', 'unset']} {...toaster} />
        </Box>
    )
};