import style from './GroupList.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { chatState, globalState } from '../../redux/store';
import { updateCurrentGroup } from '../../redux/chatSlice';
import { useContext, useEffect } from 'react';
import { WsConnection } from '../../App';
import {
  toStr,
  convertTime,
  cutMessageText,
} from '../../helpers/auxiliaryFunc';
import { Group } from '../../helpers/types';

import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Badge from 'react-bootstrap/Badge';

// A component that creates the user's group list:
function GroupList() {
  const connection = useContext<WebSocket>(WsConnection);
  const groupList = useSelector((state: chatState) => state.chat.groupList);
  const user = useSelector((state: globalState) => state.global.user);
  const currentGroup = useSelector(
    (state: chatState) => state.chat.currentGroup
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const openChat = (group: Group) => {
    dispatch(updateCurrentGroup(group));
    connection.send(
      toStr({
        type: 'getGroupMessages',
        groupId: group.group_id,
        userName: user?.user_name,
      })
    );
    navigate('/main/' + group.group_id);
  };

  useEffect(() => {
    if (groupList !== undefined && groupList.length > 0) {
      if (currentGroup === undefined) openChat(groupList[0]);
    }
  }, [groupList]);

  const backgroundColor = (group: Group): React.CSSProperties => {
    const condition = group.group_id === currentGroup?.group_id;
    return { backgroundColor: condition ? '#2a3942' : '#202c33' };
  };

  return (
    <div className={style.container}>
      <List
        className={style.list}
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      >
        {groupList &&
          groupList.map((group, index) => {
            return (
              <div key={index}>
                <ListItem
                  alignItems="flex-start"
                  onClick={() => openChat(group)}
                  className={style.item}
                  style={backgroundColor(group)}
                >
                  <ListItemAvatar>
                    <Avatar
                      className={style.image}
                      alt="image"
                      src="https://services.prod.bcomo.com/GetResource?namespace=resourceGroup_6933&resourceId=phoenix_icon_fbFace64&version=0"
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <div className={style.space_between}>
                        {group.group_name}
                        <Typography
                          sx={{ textAlignLast: 'right' }}
                          alignItems="flex-end"
                          component="span"
                          variant="body2"
                          color="#beb8ae"
                        >
                          {group.last_message
                            ? convertTime(group.last_message?.created_at)
                            : ''}
                        </Typography>
                      </div>
                    }
                    secondary={
                      <React.Fragment>
                        <div className={style.space_between}>
                          <div>
                            <Typography
                              key={1}
                              sx={{ textAlignLast: 'right' }}
                              alignItems="flex-end"
                              component="span"
                              variant="body2"
                              color="#beb8ae"
                            >
                              {group.last_message
                                ? group.last_message?.sent_by_name
                                : '-'}
                            </Typography>
                            ;
                            <Typography
                              key={2}
                              sx={{ display: 'inline' }}
                              component="span"
                              variant="body2"
                              color="#beb8ae"
                            >
                              {group.last_message
                                ? cutMessageText(group)
                                : 'no messages'}
                            </Typography>
                          </div>
                          <div>
                            {group.not_read > 0 && (
                              <Badge className={style.badge} bg="primary">
                                {group.not_read}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </div>
            );
          })}
      </List>
    </div>
  );
}

export default GroupList;
