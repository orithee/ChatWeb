import style from './GroupList.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import { chatState } from '../../redux/store';
import { updateCurrentGroup } from '../../redux/chatSlice';
import { useContext, useEffect } from 'react';
import { WsConnection } from '../../App';
import { toStr } from '../../helpers/auxiliaryFunc';
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
  const currentGroup = useSelector(
    (state: chatState) => state.chat.currentGroup
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const openChat = (group: Group) => {
    dispatch(updateCurrentGroup(group));
    connection.send(
      toStr({ type: 'getGroupMessages', groupId: group.group_id })
    );
    navigate('/main/' + group.group_id);
  };

  useEffect(() => {
    if (groupList !== undefined && groupList.length > 0) openChat(groupList[0]);
  }, [groupList]);

  const backgroundColor = (group: Group): React.CSSProperties => {
    const condition = group.group_id === currentGroup?.group_id;
    return { backgroundColor: condition ? '#2a3942' : '#202c33' };
  };

  const cutText = (group: Group | undefined) => {
    if (group === undefined) return '';
    else if (group.lastMessage?.is_image) return ': image..';
    else return ': ' + group.lastMessage?.message_text.slice(0, 10) + '...';
  };

  const convertTime = (str: string) => {
    // Displaying the current time to the user:
    let hour = Number(str.slice(0, 2)) + 3;
    if (hour > 24) return '0' + (hour -= 24) + str.slice(2, 5);
    if (10 > hour) return '0' + hour + str.slice(2, 5);
    else return hour + str.slice(2, 5);
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
              <>
                <ListItem
                  alignItems="flex-start"
                  onClick={() => openChat(group)}
                  className={style.item}
                  style={backgroundColor(group)}
                  key={index}
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
                        {group ? group.group_name : 'no group'}
                        <Typography
                          sx={{ textAlignLast: 'right' }}
                          alignItems="flex-end"
                          component="span"
                          variant="body2"
                          color="#beb8ae"
                        >
                          {group.lastMessage &&
                            convertTime(group.lastMessage.created_at)}
                        </Typography>
                      </div>
                    }
                    secondary={
                      <React.Fragment>
                        <div className={style.space_between}>
                          <div>
                            <Typography
                              sx={{ textAlignLast: 'right' }}
                              alignItems="flex-end"
                              component="span"
                              variant="body2"
                              color="#beb8ae"
                            >
                              {group ? group.lastMessage?.sent_by_name : '-'}
                            </Typography>
                            ;
                            <Typography
                              sx={{ display: 'inline' }}
                              component="span"
                              variant="body2"
                              color="#beb8ae"
                            >
                              {group.lastMessage?.message_text
                                ? cutText(group)
                                : '-'}
                            </Typography>
                          </div>
                          <div>
                            <Badge className={style.badge} bg="primary">
                              14
                            </Badge>
                          </div>
                        </div>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </>
            );
          })}
      </List>
      {/* 
        // TODO: 1. If this group does not opening now - add green indication about the message on the group list.
      */}
      {/* <ListGroup className={style.list}>
        {groupList &&
          groupList.map((group, index) => {
            return (
              <ListGroup.Item
                onClick={() => openChat(group)}
                className={style.item}
                style={backgroundColor(group)}
                key={index}
              >
                {group.group_name}
              </ListGroup.Item>
            );
          })}
      </ListGroup> */}
    </div>
  );
}

export default GroupList;
