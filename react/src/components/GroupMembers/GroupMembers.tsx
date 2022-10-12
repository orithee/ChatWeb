import style from './GroupMembers.module.scss';
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { chatState, globalState } from '../../redux/store';
import { useSelector } from 'react-redux';

export default function GroupMembers() {
  const members = useSelector((state: chatState) => state.chat.groupMembers);
  const user = useSelector((state: globalState) => state.global.user);
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <KeyboardArrowRight
        onClick={() => setOpen(!open)}
        sx={{
          mr: -1,
          opacity: 1,
          transform: open ? 'rotate(-270deg)' : 'rotate(0)',
          transition: '0.2s',
          cursor: 'pointer',
        }}
      />
      <span>
        {' '}
        members
        {open && members && (
          <div className={style.list}>
            <List
              sx={{
                width: '100%',
                maxWidth: 360,
                bgcolor: '#111b21',
                border: '1px black solid',
                borderRadius: '8px',
                zIndex: 1,
              }}
            >
              {members.map((member, index) => (
                <ListItem
                  key={index}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      background: '#202c33',
                    },
                  }}
                >
                  <ListItemText
                    sx={{
                      color:
                        member.user_name === user?.user_name
                          ? 'aquamarine'
                          : 'auto',
                    }}
                    primary={member.user_name}
                  />{' '}
                  ({member.not_read})
                </ListItem>
              ))}
            </List>
          </div>
        )}
      </span>
    </div>
  );
}
