require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { sendMessage, editMessage } = require('./bot');
const House = require('./models/House');
const userModel = require('./models/User');
const UserDto = require('./dtos/user.dto');
const cors = require('cors')
const tokenValidation = require('./middlewares/auth');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({
  origin: "*",
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}))
app.use(express.json());

app.post('/api/create-user', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Все поля нужно заполнить" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Manager with this email already exists. Try another email" });
    }

    const hash = await bcrypt.hash(password, 10);
    const createdUser = await userModel.create({ fullName, email, password: hash });

    return res.status(200).json({ user: createdUser, message: "Manager created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating user. Please try again later" });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Все поля нужно заполнить" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Мэнеджер с таким не найдет" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const userDTO = new UserDto(user);
    const accessToken = jwt.sign({ user: userDTO }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({ message: "Login successful", access_token: accessToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error logging in. Please try again later" });
  }
});

app.get('/api/get-user-info', tokenValidation, async (req, res) => {
  try {
    const { user } = req.user
    const foundedUser = await userModel.findById(user.id)
    return res.status(200).json({
      messaeg: "User information found successfuly",
      user: foundedUser
    })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error logging in. Please try again later" });
  }
})

app.post('/api/create-house', tokenValidation, async (req, res) => {
  try {
    const { user } = req.user
    const { rayon, address, landmark, informations, prepayment, price, depozit } = req.body;

    if (!rayon || !address || !landmark || !informations || !prepayment || !price || !depozit) {
      return res.status(400).json({ message: "Error: All fields are required" });
    }

    const allHouses = await House.find();
    const newId = allHouses.length + 1;

    const infoDetails = informations.map(info => `• ${info.key}: ${info.value}`).join("\n");
    console.log(infoDetails)

    const message = `
✨✨✨ СДАЁТСЯ ✨✨✨

🏠 Район: ${rayon}
📍 Адрес: ${address}
📌 Ориентир: ${landmark}
👤 Сотрудник: ${user.fullName}

Информация о квартире:
${infoDetails}

Способы оплаты:
💸 Предоплата: ${prepayment ? "да" : "нет"}
💳 Депозит: ${informations.find(info => info.key === 'Депозит')?.value || "нет"}
💰 Цена: $${price.toFixed(2)}

📅 Время освобождения: ${informations.find(info => info.key === 'Время освобождения')?.value || "не указано"}
📢 Имеются альтернативные варианты по всему городу.
🔗 Переходите по ссылке: @joyestateuz
🆔 ID: ${newId}
`;

    const messageId = await sendMessage(message);
    console.log(messageId)

    await House.create({
      employee: user.id,
      rayon,
      address,
      landmark,
      informations,
      prepayment,
      price,
      depozit,
      messageId,
      id: newId
    });
    return res.status(200).json({ message: "Message sent to channel" });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: "Something went wrong. Try again later." });
  }
});

app.put('/api/edit-house/:id', tokenValidation, async (req, res) => {
  try {
    const houseId = req.params.id;
    console.log(houseId)
    const { user } = req.user;
    const { rayon, address, landmark, informations, prepayment, price, depozit } = req.body;

    if (!rayon || !address || !landmark || !informations || !prepayment || !price || !depozit) {
      return res.status(400).json({ message: "Error: All fields are required" });
    }

    const house = await House.findById(houseId);

    if (!house) {
      return res.status(404).json({ message: "Error: House not found" });
    }

    house.rayon = rayon;
    house.address = address;
    house.landmark = landmark;
    house.informations = informations;
    house.prepayment = prepayment;
    house.price = price;
    house.depozit = depozit;

    await house.save();

    const infoDetails = informations.map(info => `• ${info.key}: ${info.value}`).join("\n");

    const message = `
✨✨✨ ИЗМЕНЕНИЕ ОБЪЯВЛЕНИЯ ✨✨✨

🏠 Район: ${rayon}
📍 Адрес: ${address}
📌 Ориентир: ${landmark}
👤 Сотрудник: ${user.fullName}

Информация о квартире:
${infoDetails}

Способы оплаты:
💸 Предоплата: ${prepayment ? "да" : "нет"}
💳 Депозит: ${informations.find(info => info.key === 'Депозит')?.value || "нет"}
💰 Цена: $${price.toFixed(2)}

📅 Время освобождения: ${informations.find(info => info.key === 'Время освобождения')?.value || "не указано"}
📢 Имеются альтернативные варианты по всему городу.
🔗 Переходите по ссылке: @joyestateuz
🆔 ID: ${house.id}
    `;

    const messageID = await editMessage(message, house.messageId);
    console.log(messageID)

    return res.status(200).json({ message: "House updated successfully and message sent to channel" });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: "Something went wrong. Try again later." });
  }
});


app.delete('/api/remove-house/:id', tokenValidation, async (req, res) => {
  try {
    const { id } = req.params;
    const find = await House.findById(id)
    const deletedHouse = await House.findOneAndDelete({ id });

    if (!deletedHouse) {
      return res.status(404).json({ message: "House not found" });
    }

    return res.status(200).json({ message: "House removed successfully" });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: "Something went wrong. Try again later." });
  }
});

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database connected");
    app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
  })
  .catch(err => {
    console.error("Database connection error:", err);
  });