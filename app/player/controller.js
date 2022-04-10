const jwt = require('jsonwebtoken');

const config = require('../../config');
const Voucher = require('../voucher/model');
const Category = require('../category/model');
const Nominal = require('../nominal/model');
const Payment = require('../payment/model');
const Bank = require('../bank/model');
const Transaction = require('../transaction/model');
const { groupByNested } = require('../../helpers/utils');
const Player = require('./model');
const { uploadImage } = require('../../helpers/file');

function compareID(firstID, secondID) {
  return firstID.toString() === secondID.toString();
}

module.exports = {
  landingPage: async (req, res) => {
    try {
      const vouchers = await Voucher.find()
        .select('_id name status category thumbnail')
        .populate('category');

      res.status(200).json({ data: vouchers });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message || 'Internal server error' });
    }
  },
  detailPage: async (req, res) => {
    try {
      const voucher = await Voucher.findOne({ _id: req.params.id })
        .populate('category')
        .populate('nominals')
        .populate('user', '_id name phoneNumber');

      if (!voucher)
        throw { code: 404, message: 'Voucher game tidak ditemukan' };

      // Add payments method
      const payments = await Payment.find().populate('banks');
      voucher._doc.payments = payments;

      res.status(200).json({ data: voucher });
    } catch (err) {
      console.log(err);
      res
        .status(err.code || 500)
        .json({ message: err.message || 'Internal server error' });
    }
  },
  getCategories: async (req, res) => {
    try {
      const categories = await Category.find();

      res.status(200).json({
        data: categories,
      });
    } catch (err) {
      console.log(err);
      res
        .status(err.code || 500)
        .json({ message: err.message || 'Internal server error' });
    }
  },
  checkout: async (req, res) => {
    try {
      const { accountUser, name, nominal, voucher, payment, bank } = req.body;

      // Cek voucher
      const res_voucher = await Voucher.findOne({ _id: voucher })
        .select('_id name category thumbnail user')
        .populate('user')
        .populate('category');
      if (!res_voucher)
        throw { code: 404, message: 'Voucher game tidak ditemukan' };

      // Cek nominal
      const res_nominal = await Nominal.findOne({ _id: nominal });
      if (!res_nominal) throw { code: 404, message: 'Nominal tidak ditemukan' };

      // Cek payment
      const res_payment = await Payment.findOne({ _id: payment });
      if (!res_payment) throw { code: 404, message: 'Payment tidak ditemukan' };

      // Cek bank
      const res_bank = await Bank.findOne({ _id: bank });
      if (!res_bank) throw { code: 404, message: 'Bank tidak ditemukan' };

      // Buat rumus pajak
      const TAX_PERCENTAGE = 10;
      const tax = (TAX_PERCENTAGE / 100) * res_nominal._doc.price;
      const neto = res_nominal._doc.price + tax;

      // Menangani transaksi
      const payload = {
        historyVoucherTopup: {
          gameName: res_voucher._doc.name,
          category: res_voucher._doc.category
            ? res_voucher._doc.category.name
            : '',
          thumbnail: res_voucher._doc.thumbnail,
          coinName: res_nominal._doc.coinName,
          coinQuantity: res_nominal._doc.coinQuantity,
          price: res_nominal._doc.price,
        },
        historyPayment: {
          name: res_bank._doc.name,
          type: res_payment._doc.type,
          bankName: res_bank._doc.bankName,
          noRekening: res_bank._doc.noRekening,
        },
        name: name,
        accountUser: accountUser,
        tax: tax,
        value: neto,
        player: req.player._id,
        category: res_voucher._doc.category?._id,
        historyUser: {
          name: req.player.name,
          phoneNumber: req.player.phoneNumber,
        },
        user: res_voucher._doc.user?._id,
      };

      const newTransaction = new Transaction(payload);

      await newTransaction.save();

      res.status(201).json({
        data: newTransaction,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(error.code || 500)
        .json({ message: error.message || 'Internal server error' });
    }
  },
  history: async (req, res) => {
    try {
      const { status = '' } = req.query;
      const criteria = {};

      if (status.length)
        criteria.status = { $regex: `${status}`, $options: 'i' };

      if (req.player._id) criteria.player = req.player._id;

      const history = await Transaction.find(criteria);

      const sumValue = await Transaction.aggregate([
        { $match: criteria },
        {
          $group: {
            _id: null,
            value: {
              $sum: '$value',
            },
          },
        },
      ]);

      res.status(200).json({
        data: history,
        totalValue: sumValue.length ? sumValue[0].value : 0,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(error.code || 500)
        .json({ message: error.message || 'Internal server error' });
    }
  },
  historyDetail: async (req, res) => {
    try {
      const { id } = req.params;

      const history = await Transaction.findOne({ _id: id });

      if (!history) throw { code: 404, message: 'History tidak ditemukan' };

      res.status(200).json({ data: history });
    } catch (error) {
      console.log(error);
      return res
        .status(error.code || 500)
        .json({ message: error.message || 'Internal server error' });
    }
  },
  dashboard: async (req, res) => {
    try {
      const transactions = await Transaction.find({
        player: req.player._id,
      })
        .populate('category')
        .sort({
          updatedAt: -1,
        });

      // Get group of categories with spent value
      const countOfCategories = groupByNested(
        transactions,
        'category.name',
        (transaction) => transaction.value
      );

      // Sum total spent based on category
      for (category in countOfCategories) {
        countOfCategories[category] = countOfCategories[category].reduce(
          (prev, current) => prev + current,
          0
        );
      }

      res
        .status(200)
        .json({ totalSpent: countOfCategories, transactions: transactions });
    } catch (error) {
      console.log(error);
      return res
        .status(error.code || 500)
        .json({ message: error.message || 'Internal server error' });
    }
  },
  getProfile: async (req, res) => {
    try {
      const defaultAvatar = 'default_avatar.png';
      const profile = {
        _id: req.player._id,
        name: req.player.name,
        username: req.player.username,
        email: req.player.email,
        avatar: req.player.avatar || defaultAvatar,
        phoneNumber: req.player.phoneNumber,
      };

      res.status(200).json({ data: profile });
    } catch (error) {
      console.log(error);
      return res
        .status(error.code || 500)
        .json({ message: error.message || 'Internal server error' });
    }
  },
  updateProfile: async (req, res) => {
    try {
      // Prepare data
      const { name, phoneNumber } = req.body;
      const payload = {
        name: name || req.player.name,
        phoneNumber: phoneNumber || req.player.phoneNumber,
      };

      // Update avatar image
      console.log('file', req.file);
      if (req.file) {
        const avatar = await uploadImage('public/uploads', req.file);
        payload.avatar = avatar || req.player.avatar;
      }

      // Update data profile
      const player = await Player.findOneAndUpdate(
        { _id: req.player._id },
        payload,
        { new: true, runValidators: true }
      );

      // Exclude password
      delete player._doc.password;

      // Save token
      const token = jwt.sign(
        {
          player: {
            id: player.id,
            username: player.username,
            email: player.email,
            name: player.name,
            phoneNumber: player.phoneNumber,
            avatar: player.avatar,
          },
        },
        config.jwtKey
      );

      res.status(201).json({
        data: { token },
      });
    } catch (error) {
      console.log(error);
      return res
        .status(error.code || 500)
        .json({ message: error.message || 'Internal server error' });
    }
  },
};
