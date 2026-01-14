import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';

import { IReduxState } from '../../../app/types';
import { getConferenceName } from '../../../base/conference/functions';
import { getLocalizedDateFormatter } from '../../../base/i18n/dateUtil';
import Button from '../../../base/ui/components/web/Button';
import { BUTTON_TYPES } from '../../../base/ui/constants.web';
import { downloadText } from '../../../base/util/downloadText';
import { showNotification } from '../../../notifications/actions';
import {
    NOTIFICATION_TIMEOUT_TYPE,
    NOTIFICATION_TYPE,
} from '../../../notifications/constants';

// @ts-ignore
import { getPolls } from '../../functions';

import { convertPollsToText } from './convertPollsToText';


const useStyles = makeStyles()(theme => {
    return {
        buttonMargin: {
            marginTop: theme.spacing(2),
        },
    };
});

const PollsDownload = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { classes } = useStyles();
    const polls = useSelector(getPolls());

    const roomName = useSelector((state: IReduxState) => getConferenceName(state));

    if (!polls.length) {
        return null;
    }

    const onClick = () => {
        try {
            const pollsText = convertPollsToText(polls, t);
            const now = Date.now();
            const date = `${getLocalizedDateFormatter(now).format('DD MM YYYY hh:mm:ss')}`;

            downloadText(pollsText, `${t('polls.download.fileName', { date, roomName })}.txt`);
            if (typeof APP !== 'undefined') {
                APP.API.pollResultsDownloadRequested(pollsText);
            }
            dispatch(
                showNotification(
                    {
                        appearance: NOTIFICATION_TYPE.NORMAL,
                        titleKey: 'polls.download.notification.title',
                    },
                    NOTIFICATION_TIMEOUT_TYPE.SHORT
                )
            );
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Button
            accessibilityLabel = { t('polls.download.buttonText') }
            className = { classes.buttonMargin }
            fullWidth = { true }
            labelKey = { 'polls.download.buttonText' }
            onClick = { onClick }
            type = { BUTTON_TYPES.SECONDARY } />
    );
};

export default PollsDownload;
