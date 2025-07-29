import { useTransaction } from '@/hooks';
import { StyleSheet, View } from 'react-native';


export default function ChartPage() {
    const { transactions } = useTransaction();
    return (
        <View>
            
        </View>
    );
}

const styles = StyleSheet.create({
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
});
