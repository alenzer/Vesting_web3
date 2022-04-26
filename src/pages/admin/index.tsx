import React, { useEffect, useState } from 'react'
import { useVesting } from 'contexts'
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from 'react-router-dom'
import { Vesting } from './Vesting'
import { VestingTypes } from './VestingTypes'
import { UserList } from './UserList'
import { makeStyles, Tab, Tabs } from '@material-ui/core'

export const Admin = () => {
  const location = useLocation()
  const history = useHistory()
  const { isVestingAdmin } = useVesting()

  const [tabValue, setTabValue] = useState('0')

  if (!isVestingAdmin) {
    return <Redirect to="/" />
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (location.pathname === '/admin/vesting') {
      setTabValue('0')
    } else if (location.pathname === '/admin/vesting_type'){
      setTabValue('1')
    } else {
      setTabValue('2')
    }
  }, [location.pathname])

  const handleTabChange = (_: any, value: string) => {
    if (value === '0') {
      history.push('/admin/vesting')
    } else if (value === '1') {
      history.push('/admin/vesting_type')
    } else {
      history.push('/admin/user')
    }
  }

  return (
    <div className='w-full flex flex-col items-center mt-6'>
      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab value="0" label="Wallet List" />
        <Tab value="1" label="Vesting Types" />
        <Tab value="2" label="User List" />
      </Tabs>

      <div className='w-full'>
        <Switch>
          <Route path="/admin/vesting_type" component={VestingTypes} />
          <Route path="/admin/vesting" component={Vesting} />
          <Route path="/admin/user" component={UserList} />
          <Redirect to="/admin/vesting" />
        </Switch>
      </div>
    </div>
  )
}
