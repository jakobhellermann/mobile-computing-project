const testUsers = [
    {
        id: 1,
        email: 'testuser-admin@example.de',
        password_hash:
            '$argon2id$v=19$m=19456,t=2,p=1$3DXNY3ps4eAq4aOUJbQW/Q$8nJaTGIFjjfZ+Geb/8YZeIzenlsmee6iYw86m751co4',
        is_admin: true,
        name: 'Some',
        first_name: 'Admin',
    },
    {
        id: 2,
        email: 'testuser-normal@example.de',
        password_hash:
            '$argon2id$v=19$m=19456,t=2,p=1$9ZHgWistHtoP5XW1r4JaEw$3LaPbmh5W3Q4t0ka8CisNJMoSYN1i1m2u9jmWjz1+8o',
        is_admin: false,
        name: 'Some',
        first_name: 'Customer',
    },
];

const testSubscriptions= [
  {
    "id": 1,
    "user": 2,
    "name": "Team 1",
    "type": "team",
    "timestamp": 1736862070238
  },
  {
    "id": 2,
    "user": 2,
    "name": "Some tournament",
    "type": "tournament",
    "timestamp": 1736862072752
  }
];

const testAddresses = [
    {
        id: 1,
        user: 2,
        name: 'Some',
        first_name: 'Customer',
        company: null,
        street: 'TestStreet 1',
        city: 'TestCity',
        zip: '12345',
        country: 'TestCountry',
    },
];

const testProducts = [
    {
        id: 1,
        category: 'Tastaturen',
        product_name: 'Logitech G213 Prodigy',
        description:
            'Gaming-Tastatur mit RGB-Beleuchtungszonen: Diese Logitech Tastatur bietet fünf separate Beleuchtungsbereiche mit Farbauswahl aus einem Spektrum von über 16,8 Millionen Farben.',
        price: 39.99,
        stock_amount: 100,
    },
    {
        id: 2,
        category: 'Tastaturen',
        product_name: 'Logitech K120',
        description:
            'Kabelgebundene Business Tastatur, Büro-tauglich: Die K120 Tastatur ist eine budgetfreundliche mechanische Büro-Tastatur die für Langlebigkeit, robuste Tasten und ein schmales, spritzwassergeschütztes Design steht.',
        price: 9.99,
        stock_amount: 500,
    },
    {
        id: 3,
        category: 'Tastaturen',
        product_name: 'Razer Ornata V3 X',
        description:
            'Flache Membran-Tastatur. Flache Tasten für ein ergonomisches Gaming-Erlebnis: Flachere Tastenkappen und kürzere Switches fördern eine natürliche Haltung der Hände und Handgelenke, damit du noch länger spielen kannst.',
        price: 41.99,
        stock_amount: 80,
    },
    {
        id: 4,
        category: 'Tastaturen',
        product_name: 'CORSAIR K55 RGB PRO',
        description:
            ' Kabelgebundene Membrantastatur - Dynamische RGB-Hintergrundbeleuchtung:Erhellen Sie Ihren Desktop mit sechs integrierten Beleuchtungseffekten, weisen Sie jeder Beleuchtungszone eine Farbe zu.',
        price: 59.99,
        stock_amount: 50,
    },
    {
        id: 5,
        category: 'Tastaturen',
        product_name: 'CHERRY KW 3000',
        description:
            ' Kabellose Tastatur mit Nummernblock, Office-Keyboard im Full-Size-Layout inkl. Cursor- und Nummernblock: Optimal für den Einsatz im Großbüro oder zu Hause - mit 2,4 GHz Funktechnologie (Reichweite bis zu 10 m).',
        price: 29.5,
        stock_amount: 250,
    },
    {
        id: 6,
        category: 'Tastaturen',
        product_name: 'Logitech G815',
        description:
            'Mechanische Gaming-Tastatur - Taktiler GL-Tasten-Switch mit flachem Profil, LIGHTSYNC RGB, 5 Programmierbare G-Tasten, Multimedia-Bedienelemente, Deutsches QWERTZ-Layout - Carbon.',
        price: 129.9,
        stock_amount: 200,
    },
    {
        id: 7,
        category: 'Mäuse',
        product_name: 'Logitech G903 LIGHTSPEED',
        description:
            'Kabellose Gaming-Maus - Der HERO 25K Sensor mit 1:1 Abtastung, mehr als 400 IPS und 100 - max. 25.600 DPI bietet 10 Mal so viel Power wie die vorherige Generation - ganz ohne Glättung, Filterung oder Beschleunigung.',
        price: 99.99,
        stock_amount: 50,
    },
    {
        id: 8,
        category: 'Mäuse',
        product_name: 'Razer Basilisk V3 X HyperSpeed',
        description:
            'Anpassbare kabellose Gaming-Maus - Legendäre ergonomische Form mit 9 individuell anpassbaren Tasten Konkurrenzloses Handling. Millionen Fans auf der ganzen Welt können sich nicht irren: die unverwechselbare Form der Maus ist ideal für verschiedene Griffhaltungen und die zahlreichen leicht erreichbaren Tasten eröffnen schier endlose Kombinationen von Befehlen und Makros.',
        price: 59.99,
        stock_amount: 0,
    },
    {
        id: 9,
        category: 'Mauspads',
        product_name: 'Corsair MM350 Champion Series',
        description:
            'Medium Premium Gaming Mauspad (Anti-Fray Cloth, Performance) schwarz - Größe Medium: Die 320x 270mmgroße Oberfläche bietet der Maus Platz für wettkampforientiertes Gaming und hat optimal auf Ihrem Schreibtisch Platz',
        price: 14.99,
        stock_amount: 1000,
    },
    {
        id: 10,
        category: 'Mauspads',
        product_name: 'Razer Gigantus V2 Medium',
        description:
            'Weiches Gaming-Mauspad für schnelle Spielstile und optimale Kontrolle (360 x 275 x 3mm, Texturierter Stoff aus Mikrogewebe, Rutschfestes Gummi) Schwarz - Texturierte Stoff-Oberfläche aus Mikrogewebe: Das Gewebe ist optimiert für alle Maus-Sensoren für pixelgenaues Tracking und perfekte Reaktionszeiten, damit die Maus noch schneller über das Pad fegt und schnelle, flüssige Bewegungen ermöglicht.',
        price: 10.99,
        stock_amount: 1000,
    },
    {
        id: 11,
        category: 'Headsets',
        product_name: 'Logitech G432',
        description:
            'Kabelgebundenes Gaming-Headset, 7.1 Surround Sound - 50-mm-Audio-Lautsprecher: Intensives, filmreifes Gaming-Erlebnis mit detailreichem Sound aus den 50-mm-Lautsprechern des Gaming-Headsets.',
        price: 55.99,
        stock_amount: 150,
    },
];

const testProductImages = [
    {
        product: 1,
        image_url:
            'https://m.media-amazon.com/images/I/614PnXILlKL._AC_SL1500_.jpg',
    },
    {
        product: 1,
        image_url:
            'https://m.media-amazon.com/images/I/61JmNTxX6-L._AC_SL1500_.jpg',
    },
    {
        product: 2,
        image_url:
            'https://m.media-amazon.com/images/I/61rcLImnB3L._AC_SL1500_.jpg',
    },
    {
        product: 2,
        image_url:
            'https://m.media-amazon.com/images/I/61hd83hVXqL._AC_SL1500_.jpg',
    },
    {
        product: 3,
        image_url:
            'https://m.media-amazon.com/images/I/81wzUL7otFL._AC_SL1500_.jpg',
    },
    {
        product: 4,
        image_url:
            'https://m.media-amazon.com/images/I/81Hqo-lIytL._AC_SL1500_.jpg',
    },
    {
        product: 4,
        image_url:
            'https://m.media-amazon.com/images/I/81nUyfaq9US._AC_SL1500_.jpg',
    },
    {
        product: 4,
        image_url:
            'https://m.media-amazon.com/images/I/81nUyfaq9US._AC_SL1500_.jpg',
    },
    {
        product: 4,
        image_url:
            'https://m.media-amazon.com/images/I/81C6+MocsWS._AC_SL1500_.jpg',
    },
    {
        product: 5,
        image_url:
            'https://m.media-amazon.com/images/I/71QcWftrNnL._AC_SL1500_.jpg',
    },
    {
        product: 6,
        image_url:
            'https://m.media-amazon.com/images/I/71FQJ-NCMFL._AC_SL1500_.jpg',
    },
    {
        product: 6,
        image_url:
            'https://m.media-amazon.com/images/I/61HczKfmgFL._AC_SL1000_.jpg',
    },
    {
        product: 6,
        image_url:
            'https://m.media-amazon.com/images/I/61zie9WPUWS._AC_SL1500_.jpg',
    },
    {
        product: 7,
        image_url:
            'https://m.media-amazon.com/images/I/61Lfwn6CwoL._AC_SL1500_.jpg',
    },
    {
        product: 8,
        image_url:
            'https://m.media-amazon.com/images/I/71fnJqCvfkL._AC_SL1500_.jpg',
    },
    {
        product: 9,
        image_url:
            'https://m.media-amazon.com/images/I/71jYSFoGbYL._AC_SL1200_.jpg',
    },
    {
        product: 9,
        image_url:
            'https://m.media-amazon.com/images/I/61l3BTeLbtL._AC_SL1200_.jpg',
    },
    {
        product: 10,
        image_url:
            'https://m.media-amazon.com/images/I/41N4vYLowlL._AC_SL1000_.jpg',
    },
    {
        product: 10,
        image_url:
            'https://m.media-amazon.com/images/I/41lAqBq2AtL._AC_SL1000_.jpg',
    },
    {
        product: 11,
        image_url:
            'https://m.media-amazon.com/images/I/61us2rqFJOS._AC_SL1500_.jpg',
    },
    {
        product: 11,
        image_url:
            'https://m.media-amazon.com/images/I/618vIsBk+1S._AC_SL1500_.jpg',
    },
];

const demoRatings = [
    {
        title: 'Exzellent!',
        comment:
            'Das Produkt hat meine Erwartungen übertroffen. Hochwertig und zuverlässig. Würde ich jederzeit wieder kaufen.',
        rating: 5,
    },
    {
        title: 'Sehr gut, aber nicht perfekt',
        comment:
            'Funktioniert einwandfrei, aber es gibt einige kleine Verbesserungsmöglichkeiten. Insgesamt sehr zufrieden.',
        rating: 4,
    },
    {
        title: 'Durchschnittlich',
        comment:
            'Das Produkt ist okay. Es erfüllt seinen Zweck, aber ich hatte mir mehr erhofft.',
        rating: 3,
    },
    {
        title: 'Enttäuschend',
        comment:
            'Die Qualität ist nicht wie erwartet. Es gab mehrere Probleme während der Nutzung. Würde ich nicht empfehlen.',
        rating: 2,
    },
    {
        title: 'Sehr schlecht',
        comment:
            'Das Produkt hat überhaupt nicht funktioniert und war eine totale Enttäuschung. Nicht zu empfehlen.',
        rating: 1,
    },
    {
        title: 'Fast perfekt',
        comment:
            'Sehr gute Leistung, aber etwas teuer. Trotzdem zufrieden mit dem Kauf.',
        rating: 4,
    },
    {
        title: 'In Ordnung',
        comment:
            'Es ist in Ordnung, aber ich habe schon bessere Produkte gesehen.',
        rating: 3,
    },
    {
        title: 'Guter Kauf',
        comment:
            'Gute Qualität und funktioniert wie beschrieben. Würde ich wieder kaufen.',
        rating: 4,
    },
    {
        title: 'Durchschnittlich',
        comment: 'Nichts Besonderes. Erfüllt seinen Zweck, aber nicht mehr.',
        rating: 3,
    },
    {
        title: 'Verbesserungswürdig',
        comment:
            'Das Produkt hat einige Schwächen und muss überarbeitet werden. Nicht sehr zufrieden.',
        rating: 2,
    },
    {
        title: 'Exzellent!',
        rating: 5,
    },
    {
        title: 'Sehr gut, aber nicht perfekt',
        rating: 4,
    },
    {
        title: 'Durchschnittlich',
        rating: 3,
    },
    {
        title: 'Enttäuschend',
        rating: 2,
    },
    {
        title: 'Sehr schlecht',
        rating: 1,
    },
    {
        title: 'Fast perfekt',
        rating: 4,
    },
    {
        title: 'In Ordnung',
        rating: 3,
    },
    {
        title: 'Guter Kauf',
        rating: 4,
    },
    {
        title: 'Verbesserungswürdig',
        rating: 2,
    },
    {
        rating: 5,
    },
    {
        rating: 4,
    },
    {
        rating: 3,
    },
    {
        rating: 2,
    },
    {
        rating: 1,
    },
];

/** @typedef {import('knex').Knex} Knex */
/**
 * @param {Knex} knex
 * @param {number} userId
 * @param {number} addressId
 * @param {number} timestamp
 * @returns {Promise<void>}
 */
const createRandomOrder = async (knex, userId, addressId, timestamp) => {
    const address = testAddresses.find((a) => a.id === addressId);

    const productCount = randomIntFromInterval(
        1,
        Math.min(5, testProducts.length),
    );

    const items = [];
    for (let i = 0; i < productCount; i++) {
        const randomProductIndex = randomIntFromInterval(
            0,
            testProducts.length - 1,
        );

        const product = testProducts[randomProductIndex];

        const quantity = randomIntFromInterval(1, 3);

        items.push({
            product: product.id,
            quantity,
            price: product.price,
        });

        const hasRated = await knex('ratings')
            .select('id')
            .where('user', userId)
            .where('product', product.id)
            .first();

        if (!hasRated) {
            const ratingIdx = randomIntFromInterval(0, demoRatings.length - 1);
            const rating = demoRatings[ratingIdx];

            await knex('ratings').insert({
                user: userId,
                product: product.id,
                verified: true,
                title: rating.title,
                comment: rating.comment,
                rating: rating.rating,
                timestamp: Date.now(),
            });
        }
    }

    const [id] = await knex('orders').insert({
        user: userId,
        status: 'PENDING',
        total: items.reduce((acc, i) => acc + i.price * i.quantity, 0),
        timestamp,
        name: address.name,
        first_name: address.first_name,
        street: address.street,
        city: address.city,
        zip: address.zip,
        country: address.country,
    });

    await knex('order_items').insert(items.map((i) => ({ ...i, order: id })));
};

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/** @typedef {import('knex').Knex} Knex */
/**
 * @param {Knex} knex
 * @returns {Promise<void>}
 */
async function up(knex) {
    await knex.schema
        .createTable('users', (t) => {
            t.increments('id').primary();
            t.string('email').notNullable().unique();
            t.string('name').notNullable();
            t.string('first_name').notNullable();
            t.string('password_hash').notNullable();
            t.boolean('is_admin').notNullable();
        })
        .createTable('subscriptions', (t) => {
            t.increments('id').primary();
            t.integer('user')
                .notNullable()
                .references('users.id')
                .onDelete('CASCADE');
            t.string('name').notNullable();
            t.string('type').notNullable();
            t.integer('timestamp').notNullable();
        })

        .createTable('addresses', (t) => {
            t.increments('id').primary();
            t.integer('user')
                .notNullable()
                .references('users.id')
                .onDelete('CASCADE');
            t.string('name').notNullable();
            t.string('first_name').notNullable();
            t.string('company');
            t.string('street').notNullable();
            t.string('city').notNullable();
            t.string('zip').notNullable();
            t.string('country').notNullable();
        })
        .createTable('sessions', (t) => {
            t.increments('id').primary();
            t.integer('user')
                .notNullable()
                .references('users.id')
                .onDelete('CASCADE');
            t.string('token_hash').notNullable().index();
            t.string('user_agent').notNullable();
            t.integer('last_used_at').notNullable();
            t.integer('created_at').notNullable();
        })
        .createTable('products', (t) => {
            t.increments('id').primary();
            t.string('product_name').notNullable();
            t.string('description').notNullable();
            t.string('category').notNullable();
            t.integer('price').notNullable();
            t.integer('stock_amount').notNullable();
            t.boolean('deleted').notNullable().defaultTo(false);
        })
        .createTable('product_images', (t) => {
            t.increments('id').primary();
            t.integer('product')
                .notNullable()
                .references('products.id')
                .onDelete('CASCADE');
            t.string('image_url').notNullable();
        })
        .createTable('ratings', (t) => {
            t.increments('id').primary();
            t.integer('user')
                .notNullable()
                .references('users.id')
                .onDelete('CASCADE');
            t.integer('product')
                .notNullable()
                .references('products.id')
                .onDelete('CASCADE');
            t.boolean('verified').notNullable();
            t.string('title');
            t.string('comment');
            t.integer('rating').notNullable();
            t.integer('timestamp').notNullable();
        })
        .createTable('coupons', (t) => {
            t.increments('id').primary();
            t.string('code').notNullable().unique();
            t.integer('discount').notNullable();
            // percentage or fixed amount
            t.string('discount_type').notNullable();
            t.integer('valid_until').notNullable();
            t.integer('min_order_value');
        })
        .createTable('orders', (t) => {
            t.increments('id').primary();
            t.integer('user')
                .notNullable()
                .references('users.id')
                .onDelete('CASCADE');
            t.integer('status').notNullable();
            t.integer('total').notNullable();
            t.integer('timestamp').notNullable();
            t.string('name').notNullable();
            t.string('first_name').notNullable();
            t.string('company');
            t.string('street').notNullable();
            t.string('city').notNullable();
            t.string('zip').notNullable();
            t.string('country').notNullable();
        })
        .createTable('order_items', (t) => {
            t.increments('id').primary();
            t.integer('order')
                .notNullable()
                .references('orders.id')
                .onDelete('CASCADE');
            t.integer('product')
                .notNullable()
                .references('products.id')
                .onDelete('CASCADE');
            t.integer('quantity').notNullable();
            t.integer('price').notNullable();
        })
        .createTable('order_discounts', (t) => {
            t.increments('id').primary();
            t.integer('discount').notNullable();
            t.integer('order')
                .notNullable()
                .references('orders.id')
                .onDelete('CASCADE');
        });

    await seedTestData(knex);
}

/** @typedef {import('knex').Knex} Knex */
/**
 * @param {Knex} db
 * @returns {Promise<void>}
 */
const seedTestData = async (db) => {
    // Insert test users
    await db('users').insert(testUsers);

    // Insert test addresses
    await db('addresses').insert(testAddresses);

    // Insert test products
    await db('products').insert(testProducts);
    // Insert test product images
    await db('product_images').insert(testProductImages);

    await db('subscriptions').insert(testSubscriptions)

    // Orders for feb 2024
    await createRandomOrder(db, 2, 1, 1707737786);
    await createRandomOrder(db, 2, 1, 1707737786);
    await createRandomOrder(db, 2, 1, 1707737786);
    await createRandomOrder(db, 2, 1, 1707737786);
    await createRandomOrder(db, 2, 1, 1707737786);
    await createRandomOrder(db, 2, 1, 1707737786);
    await createRandomOrder(db, 2, 1, 1707737786);
    await createRandomOrder(db, 2, 1, 1707737786);
    await createRandomOrder(db, 2, 1, 1707737786);
    await createRandomOrder(db, 2, 1, 1707737786);
    await createRandomOrder(db, 2, 1, 1707737786);
    await createRandomOrder(db, 2, 1, 1707737786);

    // Orders for march 2024
    await createRandomOrder(db, 2, 1, 1710243386000);
    await createRandomOrder(db, 2, 1, 1710243386000);
    await createRandomOrder(db, 2, 1, 1710243386000);
    await createRandomOrder(db, 2, 1, 1710243386000);
    await createRandomOrder(db, 2, 1, 1710243386000);
    await createRandomOrder(db, 2, 1, 1710243386000);

    // Orders for april 2024
    await createRandomOrder(db, 2, 1, 1719159125000);
    await createRandomOrder(db, 2, 1, 1719159125000);
    await createRandomOrder(db, 2, 1, 1719159125000);
    await createRandomOrder(db, 2, 1, 1719159125000);

    // Orders for may 2024
    await createRandomOrder(db, 2, 1, 1715510186000);
    await createRandomOrder(db, 2, 1, 1715510186000);
    await createRandomOrder(db, 2, 1, 1715510186000);
    await createRandomOrder(db, 2, 1, 1715510186000);
    await createRandomOrder(db, 2, 1, 1715510186000);
    await createRandomOrder(db, 2, 1, 1715510186000);
    await createRandomOrder(db, 2, 1, 1715510186000);

    // Orders for june 2024
    await createRandomOrder(db, 2, 1, 1713881098000);
    await createRandomOrder(db, 2, 1, 1713881098000);
    await createRandomOrder(db, 2, 1, 1713881098000);
    await createRandomOrder(db, 2, 1, 1713881098000);
    await createRandomOrder(db, 2, 1, 1713881098000);
    await createRandomOrder(db, 2, 1, 1713881098000);

    // Orders for july 2024
    await createRandomOrder(db, 2, 1, 1721743925000);
    await createRandomOrder(db, 2, 1, 1721743925000);
    await createRandomOrder(db, 2, 1, 1721743925000);
    await createRandomOrder(db, 2, 1, 1721743925000);
    await createRandomOrder(db, 2, 1, 1721743925000);

    for (const product of testProducts) {
        for (let i = 0; i < randomIntFromInterval(10, 100); i++) {
            const user = {
                email: `foo-${Math.random()}@example.de`,
                name: 'Review',
                first_name: 'User',
                password_hash: '',
                is_admin: false,
            };

            const [id] = await db('users').insert(user);
            const ratingIdx = randomIntFromInterval(0, demoRatings.length - 1);
            const rating = demoRatings[ratingIdx];

            await db('ratings').insert({
                user: id,
                product: product.id,
                verified: false,
                title: rating.title,
                comment: rating.comment,
                rating: rating.rating,
                timestamp: Date.now(),
            });
        }
    }
};

/**
 * @param {Knex} knex
 * @returns {Promise<void>}
 */
async function down(knex) {
    await knex.schema
        .dropTableIfExists('order_items')
        .dropTableIfExists('orders')
        .dropTableIfExists('ratings')
        .dropTableIfExists('product_images')
        .dropTableIfExists('products')
        .dropTableIfExists('users');
}

module.exports = { up, down };
