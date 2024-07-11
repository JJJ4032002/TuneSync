import { colors } from '@/constants/tokens'
import { menu } from '@/helpers/types'
import { defaultStyles } from '@/styles'
import { AntDesign } from '@expo/vector-icons'
import { StyleSheet, Text, TouchableHighlight, TouchableHighlightProps, View } from 'react-native'

type MenuItemProps = {
	menu: menu
} & TouchableHighlightProps

export const MenuItem = ({ menu, ...props }: MenuItemProps) => {
	return (
		<TouchableHighlight activeOpacity={0.8} {...props}>
			<View style={styles.playlistItemContainer}>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
						width: '100%',
					}}
				>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'flex-start',
							alignItems: 'center',
							width: '100%',
						}}
					>
						{menu.icon}
						<Text numberOfLines={1} style={styles.playlistNameText}>
							{menu.title}
						</Text>
					</View>
					<View>
						<AntDesign name="right" size={16} color={colors.icon} style={{ opacity: 0.5 }} />
					</View>
				</View>
			</View>
		</TouchableHighlight>
	)
}

const styles = StyleSheet.create({
	playlistItemContainer: {
		flexDirection: 'row',
		columnGap: 14,
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingRight: 20,
	},
	playlistArtworkImage: {
		borderRadius: 8,
		width: 70,
		height: 70,
	},
	playlistNameText: {
		...defaultStyles.text,
		paddingLeft: 16,
		fontSize: 17,
		fontWeight: '600',
		// maxWidth: '80%',
	},
})