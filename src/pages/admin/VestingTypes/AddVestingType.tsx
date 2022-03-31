/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import {
  Box,
  Button,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { useVesting } from 'contexts';
import { useHistory, useParams } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  root: {
    width: 500,
    margin: '1rem',
    padding: '1rem',
    boxSizing: 'border-box',
    border: '1px solid black',
    borderRadius: 8,
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  row: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '0.5rem',
  },
  input: {
    width: '100%',
  },
}));

interface IAddVestingType {
  edit?: boolean;
}

interface IParam {
  id?: string;
}

export const AddVestingType: React.FC<IAddVestingType> = ({ edit }) => {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams<IParam>();
  const { addVestingType, updateVestingType, vestingTypes } = useVesting();

  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [lockupDuration, setLockupDuration] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (edit && vestingTypes.length > Number(id)) {
      const info = vestingTypes[Number(id)];
      setName(info.name);
      setStartTime(new Date(info.startTime * 1000));
      setEndTime(new Date(info.endTime * 1000));
      setLockupDuration(
        Math.abs(info.lockupDuration / 60 / 60 / 24).toString()
      );
      setMaxAmount(info.maxAmount.toString());
    }
  }, [vestingTypes]);

  const handleSubmit = async () => {
    setLoading(true);
    let res = false;
    if (edit) {
      if (Number(id) >= 0) {
        res = await updateVestingType(
          Number(id),
          name,
          Math.floor(startTime.getTime() / 1000),
          Math.floor(endTime.getTime() / 1000),
          Math.floor(Number(lockupDuration)) * 24 * 60 * 60,
          Number(maxAmount)
        );
      }
    } else {
      res = await addVestingType(
        name,
        Math.floor(startTime.getTime() / 1000),
        Math.floor(endTime.getTime() / 1000),
        Math.floor(Number(lockupDuration)) * 24 * 60 * 60,
        Number(maxAmount)
      );
    }
    setLoading(false);

    if (res) {
      history.push('/admin/vesting_type');
    }
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Box className={clsx(classes.root, classes.flex)}>
        <Typography variant="h5">
          {edit ? 'Edit' : 'Add'} vesting type
        </Typography>
        <br />

        <Box className={classes.row}>
          <TextField
            variant="outlined"
            label="Type Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            className={classes.input}
          />
        </Box>

        <Box className={classes.row}>
          <DateTimePicker
            label="Start Time"
            value={startTime}
            onChange={(_date) => setStartTime(_date as Date)}
            className={classes.input}
            disabled={loading}
          />
        </Box>

        <Box className={classes.row}>
          <DateTimePicker
            label="End Time"
            value={endTime}
            onChange={(_date) => setEndTime(_date as Date)}
            className={classes.input}
            disabled={loading}
          />
        </Box>

        <Box className={classes.row}>
          <TextField
            variant="outlined"
            type="number"
            label="Lockup Duration (days)"
            value={lockupDuration}
            onChange={(e) => setLockupDuration(e.target.value)}
            disabled={loading}
            className={classes.input}
          />
        </Box>

        <Box className={classes.row}>
          <TextField
            variant="outlined"
            type="number"
            label="Total Amount"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
            disabled={loading}
            className={classes.input}
          />
        </Box>

        <Box className={classes.row}>
          <Button
            color="primary"
            variant="contained"
            disabled={loading || !(Number(maxAmount) > 0)}
            className={classes.input}
            onClick={handleSubmit}
          >
            {loading ? 'Confirming' : 'Confirm'}
          </Button>
        </Box>
      </Box>
    </MuiPickersUtilsProvider>
  );
};