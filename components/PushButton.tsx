import React from 'react';
import { Button } from 'react-native';

type PushButtonProps = {
    onPress: () => void;
    title?: string;
};

export default function PushButton({ onPress, title = 'Отримати повідомлення' }: PushButtonProps) {
    return (
        <Button
            title={title}
            onPress={onPress}
        />
    );
}
