import { TracksListItem } from '@/components/TracksListItem'
import { unknownTrackImageUri } from '@/constants/images'
import { useQueue } from '@/store/queue'
import { utilsStyles } from '@/styles'
import { useCallback, useRef } from 'react'
import { FlatList, FlatListProps, Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import TrackPlayer, { Track } from 'react-native-track-player'
import { QueueControls } from './QueueControls'

export type TracksListProps = Partial<FlatListProps<Track>> & {
	id: string
	tracks: Track[]
	hideQueueControls?: boolean
}

const ItemDivider = () => (
	<View style={{ ...utilsStyles.itemSeparator, marginVertical: 9, marginLeft: 60 }} />
)

export const TracksList = ({
	id,
	setPage,
	currentPage,
	tracks,
	hideQueueControls = false,
	...flatlistProps
}: TracksListProps) => {
	const queueOffset = useRef(0)
	const { activeQueueId, setActiveQueueId } = useQueue()

	const handleTrackSelect = useCallback(
		async (selectedTrack: Track) => {
			const trackIndex = tracks.findIndex((track) => track.url === selectedTrack.url)
			console.log('trackIndex', trackIndex)

			if (trackIndex === -1) return

			const isChangingQueue = id !== activeQueueId

			if (isChangingQueue) {
				const beforeTracks = tracks.slice(0, trackIndex)
				const afterTracks = tracks.slice(trackIndex + 1)

				await TrackPlayer.reset()
				await TrackPlayer.add([selectedTrack, ...afterTracks, ...beforeTracks])
				await TrackPlayer.play()

				queueOffset.current = trackIndex
				setActiveQueueId(id)
			} else {
				const nextTrackIndex =
					trackIndex - queueOffset.current < 0
						? tracks.length + trackIndex - queueOffset.current
						: trackIndex - queueOffset.current
				console.log('nextTrackIndex', nextTrackIndex)

				await TrackPlayer.skip(nextTrackIndex)
				TrackPlayer.play()
			}
		},
		[tracks, id, activeQueueId, setActiveQueueId],
	)
	const renderItem = useCallback(
		({ item: track }) => {
			return <TracksListItem key={track.filename} track={track} onTrackSelect={handleTrackSelect} />
		},
		[handleTrackSelect],
	)
	const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
		const paddingToBottom = 200
		return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom
	}

	return (
		<FlatList
			// onScroll={({ nativeEvent }) => {
			// 	if (isCloseToBottom(nativeEvent)) {
			// 		setPage(currentPage + 1)
			// 		console.log('scroll to end')
			// 	}
			// }}
			data={tracks}
			renderItem={renderItem}
			keyExtractor={(item) => item.filename}
			scrollEventThrottle={400}
			onEndReachedThreshold={0.5}
			maxToRenderPerBatch={15}
			initialNumToRender={15}
			removeClippedSubviews={true}
			contentContainerStyle={{ paddingTop: 10, paddingBottom: 128 }}
			ListHeaderComponent={
				!hideQueueControls ? (
					<QueueControls tracks={tracks} style={{ paddingBottom: 20 }} />
				) : undefined
			}
			ListFooterComponent={ItemDivider}
			ItemSeparatorComponent={ItemDivider}
			ListEmptyComponent={
				<View>
					<Text style={utilsStyles.emptyContentText}>No songs found</Text>
					<FastImage
						source={{ uri: unknownTrackImageUri, priority: FastImage.priority.normal }}
						style={utilsStyles.emptyContentImage}
					/>
				</View>
			}
			{...flatlistProps}
		/>
	)
}
