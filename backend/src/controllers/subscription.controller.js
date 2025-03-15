import { Subscription } from "../models/subscription.model.js"

const toggleSubscription = async (req, res) => {
    try {
        const { channelId } = req.params
        if (channelId === req?.user?._id)
            return res.status(401).json({
                msg: "Cannot Subscribe to Self"
            })

        const isSubscribed = await Subscription.findOne({
            channel: channelId,
            subscriber: {
                $in: { _id: req.user?._id }
            }
        })


        if (isSubscribed && isSubscribed !== null) {
            await Subscription.findByIdAndDelete(isSubscribed?._id)

            const subStatus = await Subscription.find({
                subscriber: req?.user?._id,
                channel: channelId
            })

            return res.status(200).json({
                msg: "unsubscribed",
                subStatus
            })
        }
        else {
            const subStatus = await Subscription.create({
                subscriber: req?.user?._id,
                channel: channelId
            })


            return res.status(200).json({
                msg: "subscribed",
                subStatus: [subStatus]
            })
        }
    } catch (error) {
        return res.status(500).json({
            msg: "error subscribing / unsubscribing",
            err: error.message
        })
    }
}

const getSubscribedChannels = async (req, res) => {
    try {
        const userSubscribedToChannels = await Subscription.find({
            subscriber: req?.user?._id
        }).populate('channel', 'username fullName avatar').sort({
            createdAt: -1
        })

        return res.status(200).json({
            msg: "list of channels subscribed by user",
            userSubscribedToChannels
        })
    } catch (error) {
        return res.status(500).json({
            err: error.message
        })
    }
}

export {
    toggleSubscription,
    getSubscribedChannels
}